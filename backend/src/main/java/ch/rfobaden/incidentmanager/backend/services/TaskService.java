package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.EmailConfig;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.TaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

@Service
public class TaskService extends ModelRepositoryService<Task, TaskPath, TaskRepository> {

    private final EmailConfig emailConfig;

    public TaskService(EmailConfig emailConfig) {
        super();
        this.emailConfig = emailConfig;
    }

    @Override
    public Task create(TaskPath path, Task task) {
        Task savedTask = super.create(path, task);
        if (savedTask.getAssignee() != null) {
            // Ereignis/Meldung/Auftrag
            String info = savedTask.getReport().getIncident().getTitle() + "/"
                + savedTask.getReport().getTitle() + "/" + savedTask.getTitle();
            // {host}/ereignisse/{incident-id}/meldungen/{report-id}/auftraege/{task-id}
            String link = "ereignisse/" + savedTask.getReport().getIncident().getId()
                + "/meldungen/" + savedTask.getReport().getId()
                + "/auftraege/" + savedTask.getId();
            emailConfig.sendSimpleMessage(savedTask.getAssignee().getEmail(),
                "IM-Tool RFOBaden: Zuweisung",
                emailConfig.getAssignedTemplateMessage(info, link));
        }
        return savedTask;
    }
}
