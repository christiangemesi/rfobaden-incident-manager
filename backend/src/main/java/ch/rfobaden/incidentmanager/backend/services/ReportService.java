package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Incident;
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
    protected void afterSave(Report oldReport, Report report) {
        notificationService.notifyAssigneeIfChanged(oldReport, report);
    }

    /**
     * Loads all assigned {@link Report reports} over all opened {@link Incident incidents}.
     *
     * @param id The id of the {@link User assignee}.
     * @return The list of assigned reports.
     */
    public List<Report> listWhereAssigneeId(Long id) {
        return repository.findAllByAssigneeId(id);
    }
}
