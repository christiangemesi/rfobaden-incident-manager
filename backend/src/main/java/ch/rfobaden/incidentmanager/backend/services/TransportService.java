package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.repos.TransportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.notifications.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransportService
    extends ModelRepositoryService<Transport, TransportPath, TransportRepository> {
    private final NotificationService notificationService;

    public TransportService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    protected void afterSave(Transport oldRecord, Transport record) {
        notificationService.notifyAssigneeIfChanged(oldRecord, record);
    }

    public List<Transport> listWhereAssigneeId(Long id) {
        return repository.findAllByAssigneeId(id);
    }

}
