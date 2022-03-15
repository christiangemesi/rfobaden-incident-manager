package ch.rfobaden.incidentmanager.backend.services;

import java.util.Optional;

import ch.rfobaden.incidentmanager.backend.EmailConfig;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.SubtaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

@Service
public class SubtaskService
    extends ModelRepositoryService<Subtask, SubtaskPath, SubtaskRepository> {

    private final EmailConfig emailConfig;

    public SubtaskService(EmailConfig emailConfig) {
        super();
        this.emailConfig = emailConfig;
    }

    @Override
    public Subtask create(SubtaskPath path, Subtask subTask) {
        Subtask savedSubTask = super.create(path, subTask);
        if (savedSubTask.getAssignee() != null) {
            sendAssignmentEmail(savedSubTask);
        }
        return savedSubTask;
    }

    @Override
    public Optional<Subtask> update(SubtaskPath path, Subtask subTask) {
        Optional<Subtask> oldSubTask = repository.findById(subTask.getId());
        if (oldSubTask.isEmpty()) {
            return Optional.empty();
        }
        Optional<Subtask> savedSubTask = super.update(path, subTask);
        savedSubTask.ifPresent(rep -> {
            if (rep.getAssigneeId() != null &&
                rep.getAssigneeId().equals(oldSubTask.get().getAssigneeId())) {
                sendAssignmentEmail(rep);
            }
        });
        return savedSubTask;
    }

    private void sendAssignmentEmail(Subtask subTask) {
        // Ereignis/Meldung/Auftrag/Teilauftrag
        String info = subTask.getTask().getReport().getIncident().getTitle() + "/"
            + subTask.getTask().getReport().getTitle() + "/"
            + subTask.getTask().getTitle() + "/"
            + subTask.getTitle();
        // {host}/ereignisse/{incident-id}/meldungen/{report-id}/auftraege/{task-id}
        String link = "ereignisse/" + subTask.getTask().getReport().getIncident().getId()
            + "/meldungen/" + subTask.getTask().getReport().getId()
            + "/auftraege/" + subTask.getTask().getId();
        emailConfig.sendSimpleMessage(subTask.getAssignee().getEmail(),
            "IM-Tool RFOBaden: Zuweisung", emailConfig.getAssignmentTemplateMessage(info, link));
    }
}
