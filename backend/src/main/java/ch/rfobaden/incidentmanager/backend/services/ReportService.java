package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.ReportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.notifications.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService extends ModelRepositoryService<Report, ReportPath, ReportRepository> {
    private final NotificationService notificationService;

    public ReportService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    protected void afterSave(Report oldRecord, Report record) {
        notificationService.notifyAssigneeIfChanged(oldRecord, record);
    }

    public List<Report> findAllAssignedReports(User user) {
        return repository.findAllByAssignee(user);
    }
}
