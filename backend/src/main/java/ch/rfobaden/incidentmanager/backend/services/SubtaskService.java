package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.repos.SubtaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.notifications.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubtaskService
    extends ModelRepositoryService<Subtask, SubtaskPath, SubtaskRepository> {

    private final NotificationService notificationService;

    public SubtaskService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    protected void afterSave(Subtask oldSubtask, Subtask subtask) {
        notificationService.notifyAssigneeIfChanged(oldSubtask, subtask);
    }

    public List<Subtask> findAllAssignedSubtasks(User user) {
        return repository.findAllByAssignee(user);
    }
}
