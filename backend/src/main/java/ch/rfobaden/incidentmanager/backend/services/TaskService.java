package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.EmailConfig;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.TaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
            sendAssignmentEmail(savedTask);
        }
        return savedTask;
    }

    @Override
    public Optional<Task> update(TaskPath path, Task task) {
        Optional<Task> oldTask = find(path, task.getId());
        if (oldTask.isEmpty()) {
            return Optional.empty();
        }
        Long oldTaskId = oldTask.get().getAssigneeId();
        Optional<Task> savedTask = super.update(path, task);
        savedTask.ifPresent(rep -> {
            if (rep.getAssigneeId() != null
                && !rep.getAssigneeId().equals(oldTaskId)) {
                sendAssignmentEmail(rep);
            }
        });
        return savedTask;
    }

    private void sendAssignmentEmail(Task task) {
        String info = task.getReport().getIncident().getTitle() + "/"
            + task.getReport().getTitle() + "/" + task.getTitle();
        String link = "ereignisse/" + task.getReport().getIncident().getId()
            + "/meldungen/" + task.getReport().getId()
            + "/auftraege/" + task.getId();
        emailConfig.sendSimpleMessage(task.getAssignee().getEmail(),
            "IM-Tool RFOBaden: Zuweisung",
            emailConfig.getAssignmentTemplateMessage(info, link));
    }
}
