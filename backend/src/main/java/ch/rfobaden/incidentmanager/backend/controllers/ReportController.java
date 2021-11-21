package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Completion;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    private final IncidentService incidentService;

    @Autowired
    public ReportController(ReportService reportService, IncidentService incidentService) {
        this.reportService = reportService;
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<Report> getReports() {
        return reportService.getReports();
    }

    @GetMapping({"{reportId}"})
    public Report getReportById(@PathVariable("reportId") Long reportId) {
        return reportService.getReportById(reportId).orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "report not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public Report addNewReport(@RequestBody Report report) {
        return reportService.addNewReport(report);
    }

    @PutMapping("{reportId}/close")
    @ResponseStatus(HttpStatus.OK)
    public Report closeReport(
            @PathVariable("reportId") Long reportId,
            /* TODO: check close mechanism -> in IncidentController is a inner static class,
                    so I guess that is not the final approach to close incidents, reports, ...
                    Should we use the Completion class here or should we export the
                    CloseIncidentData class out of the controller and rename it?
                    Or something else?
            */
            @RequestBody Completion completion
    ) {
        return reportService.closeReport(reportId, completion)
                .orElseThrow(() -> (
                        new ApiException(HttpStatus.NOT_FOUND, "incident not found")
                ));
    }

    @PutMapping("{reportId}/reopen")
    @ResponseStatus(HttpStatus.OK)
    public Report reopenReport(
            @PathVariable("reportId") Long reportId) {
        return reportService.reopenReport(reportId)
                .orElseThrow(() -> (
                        new ApiException(HttpStatus.NOT_FOUND, "incident not found")
                ));
    }

    @DeleteMapping("{reportId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReportById(@PathVariable("reportId") Long reportId) {
        if (!reportService.deleteReportById(reportId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "report not found");
        }
    }
}
