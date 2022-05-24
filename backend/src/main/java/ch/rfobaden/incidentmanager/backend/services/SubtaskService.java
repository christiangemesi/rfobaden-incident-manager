package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.repos.SubtaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.notifications.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

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

    /**
     * Loads all assigned {@link Subtask subtasks} over all opened {@link Incident incidents}.
     *
     * @param id The id of the {@link User assignee}.
     * @return The list of assigned subtasks.
     */
    public List<Subtask> listWhereAssigneeId(Long id) {
        return repository.findAllByAssigneeId(id);
    }
}
