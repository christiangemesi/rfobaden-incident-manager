package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
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
        // TODO : Are the following checks done with the getIncidentById() request?
        // TODO check if incidentId exists
        // TODO check if incident exist
        var incident = incidentService.getIncidentById(report.getIncidentId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "incident not found"));
        report.setIncident(incident);
        return reportService.addNewReport(report);
    }

    // TODO: Add close method
    @PutMapping("{reportId}/close")


    @DeleteMapping("{reportId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReportById(@PathVariable("reportId") Long reportId) {
        if (!reportService.deleteReportById(reportId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "report not found");
        }
    }
}
