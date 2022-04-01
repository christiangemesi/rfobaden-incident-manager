package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAdmin;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/incidents/{incidentId}/reports")
public class ReportController extends ModelController<Report, ReportPath, ReportService> {
    private final IncidentService incidentService;

    private final UserService userService;

    public ReportController(
        IncidentService incidentService,
        UserService userService
    ) {
        this.incidentService = incidentService;
        this.userService = userService;
    }

    @Override
    @RequireAgent
    public Report create(@ModelAttribute ReportPath path, @RequestBody Report entity) {
        return super.create(path, entity);
    }

    @Override
    @RequireAgent
    public Report update(
        @ModelAttribute ReportPath path,
        @PathVariable("id") Long id,
        @RequestBody Report entity
    ) {
        return super.update(path, id, entity);
    }

    @Override
    @RequireAgent
    public void delete(@ModelAttribute ReportPath path, @PathVariable("id") Long id) {
        super.delete(path, id);
    }

    @Override
    protected void loadRelations(ReportPath path, Report report) {
        var incident = incidentService.find(path, path.getIncidentId())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "incident not found"));
        report.setIncident(incident);

        if (report.getAssignee() != null) {
            var assignee = userService.find(report.getAssignee().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "assignee not found"));
            report.setAssignee(assignee);
        }
    }
}
