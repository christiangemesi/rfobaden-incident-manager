package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.ReportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.utils.validation.Violations;
import org.springframework.stereotype.Service;

@Service
public class ReportService extends ModelRepositoryService<Report, ReportPath, ReportRepository> {
    private final UserService userService;

    public ReportService(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void loadRelations(Report report, Violations violations) {
        if (report.getAssignee() != null) {
            userService.find(report.getAssigneeId()).ifPresentOrElse(report::setAssignee, () ->
                violations.add("assignee", "does not exist")
            );
        }
    }
}
