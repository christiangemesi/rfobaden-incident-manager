package ch.rfobaden.incidentmanager.backend.services.notifications;

import ch.rfobaden.incidentmanager.backend.models.Trackable;
import ch.rfobaden.incidentmanager.backend.models.User;
import org.springframework.stereotype.Service;

@Service
public interface NotificationService {
    void notifyNewUser(User user, String plainPassword);

    void notifyAssignee(Trackable entity, User assignee);

    default void notifyAssigneeIfChanged(Trackable oldEntity, Trackable entity) {
        var assignee = entity.getAssignee();
        if (assignee != null
            && (oldEntity == null || !assignee.getId().equals(oldEntity.getAssigneeId()))) {
            notifyAssignee(entity, assignee);
        }
    }
}
