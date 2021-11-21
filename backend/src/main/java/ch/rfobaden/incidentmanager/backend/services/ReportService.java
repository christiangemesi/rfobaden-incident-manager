package ch.rfobaden.incidentmanager.backend.services;

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

    private final IncidentRepository incidentRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository, IncidentRepository incidentRepository) {
        this.reportRepository = reportRepository;
        this.incidentRepository = incidentRepository;
    }

    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(Long reportId) {
        return reportRepository.findById(reportId);
    }

    public Report addNewReport(Report report) {
        boolean incidentExists = incidentRepository.existsById(report.getIncidentId());
        Incident incidentOfId = incidentRepository.findById(report.getIncidentId()).orElse(null);
        if (!incidentExists || incidentOfId == null) {
            throw new IllegalArgumentException("incident not found");
        }
        report.setIncident(incidentOfId);
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public Optional<Report> updateReport(Long reportId, Report report) {
        Report reportOfId = reportRepository.findById(reportId).orElse(null);
        if (reportOfId == null) {
            return Optional.empty();
        }
        if (!Objects.equals(report.getIncidentId(), reportId)) {
            throw new IllegalArgumentException("body id differ from parameter id");
        }
        report.setUpdatedAt(LocalDateTime.now());
        return Optional.of(reportRepository.save(report));
    }

    public boolean deleteReportById(Long reportId) {
        if (reportRepository.existsById(reportId)) {
            reportRepository.deleteById(reportId);
            return true;
        }
        return false;
    }
}
