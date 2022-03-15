package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.EmailConfig;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
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
            // Ereignis/Meldung/Auftrag/Teilauftrag
            String info = savedSubTask.getTask().getReport().getIncident().getTitle() + "/"
                + savedSubTask.getTask().getReport().getTitle() + "/"
                + savedSubTask.getTask().getTitle() + "/"
                + savedSubTask.getTitle();
            // {host}/ereignisse/{incident-id}/meldungen/{report-id}/auftraege/{task-id}
            String link = "ereignisse/" + savedSubTask.getTask().getReport().getIncident().getId()
                + "/meldungen/" + savedSubTask.getTask().getReport().getId()
                + "/auftraege/" + savedSubTask.getTask().getId();
            emailConfig.sendSimpleMessage(savedSubTask.getAssignee().getEmail(),
                "IM-Tool RFOBaden: Zuweisung", emailConfig.getAssignedTemplateMessage(info, link));
        }
        return savedSubTask;
    }
}
