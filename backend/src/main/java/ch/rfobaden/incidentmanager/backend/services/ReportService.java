package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.controllers.data.CompletionData;
import ch.rfobaden.incidentmanager.backend.models.Completable;
import ch.rfobaden.incidentmanager.backend.models.Completion;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.repos.IncidentRepository;
import ch.rfobaden.incidentmanager.backend.repos.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(Long reportId) {
        return reportRepository.findById(reportId);
    }

    public Optional<Report> getReportOfIncidentById(Long incidentId, Long reportId) {
        return reportRepository.findByIncidentIdAndId(incidentId, reportId);
    }

    public List<Report> getAllReportsOfIncidentById(Long incidentId) {
        return reportRepository.findAllByIncidentId(incidentId);
    }

    public Report addNewReport(Report report) {
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public Optional<Report> updateReport(Report report) {
        report.setUpdatedAt(LocalDateTime.now());
        return Optional.of(reportRepository.save(report));
    }

    public Optional<Report> closeReport(Report report, CompletionData completionData) {
        report.setCompletion(completionData.getReason());
        return updateReport(report);
    }

    public Optional<Report> reopenReport(Report report) {
        report.setComplete(true);
        return updateReport(report);
    }

    public boolean deleteReportById(Long reportId) {
        if (reportRepository.existsById(reportId)) {
            reportRepository.deleteById(reportId);
            return true;
        }
        return false;
    }


}
