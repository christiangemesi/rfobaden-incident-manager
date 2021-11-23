package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Completion;
import ch.rfobaden.incidentmanager.backend.models.Report;
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

    public List<Report> getReportsOfIncident(Long incidentId) {
        return reportRepository.findAllOfIncident(incidentId);
    }

    public Optional<Report> getReportById(Long reportId) {
        return reportRepository.findById(reportId);
    }

    public Optional<Report> getReportOfIncidentById(Long incidentId, Long reportId) {
        return reportRepository.findByIdOfIncident(incidentId, reportId);
    }

    public Report addNewReport(Report report) {
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public Optional<Report> updateReport(Long id, Report report) {
        var persistentReport = getReportById(id).orElse(null);
        if (persistentReport == null) {
            return Optional.empty();
        }

        if (report.getId() != null && !Objects.equals(report.getId(), id)) {
            throw new IllegalArgumentException("can't update report id");
        }
        report.setId(id);

        if (
            report.isComplete() != persistentReport.isComplete()
                || report.getCompletion() != null
                && !Objects.equals(report.getCompletion(), persistentReport.getCompletion())
        ) {
            throw new IllegalArgumentException("can't update report completion");
        }
        report.setComplete(persistentReport.isComplete());
        report.setCompletion(persistentReport.getCompletion());

        report.setIncident(persistentReport.getIncident());
        report.setCreatedAt(persistentReport.getCreatedAt());
        report.setUpdatedAt(LocalDateTime.now());
        return Optional.of(reportRepository.save(report));
    }

    public Optional<Report> completeReportOfIncident(Long incidentId, Long id, String reason) {
        var report = getReportOfIncidentById(incidentId, id).orElse(null);
        if (report == null) {
            return Optional.empty();
        }

        var completion = new Completion();
        completion.setReason(reason);
        completion.setCreatedAt(LocalDateTime.now());
        completion.setPrevious(report.getCompletion());

        report.setCompletion(completion);
        report.setComplete(true);
        report.setUpdatedAt(LocalDateTime.now());

        System.out.println(report);

        return Optional.of(reportRepository.save(report));
    }

    public Optional<Report> reopenReportOfIncident(Long incidentId, Long id) {
        var report = getReportOfIncidentById(incidentId, id).orElse(null);
        if (report == null) {
            return Optional.empty();
        }
        report.setComplete(false);
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
