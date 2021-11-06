package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.repos.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public Report addNewReport(Report report) {
        // TODO set date / time attr
        return reportRepository.save(report);
    }

    public Optional<Report> updateReport(Long reportId, Report report) {
        Report reportById = reportRepository.findById(reportId).orElse(null);
        if (reportById == null) {
            return Optional.empty();
        }
//        if (reportById.getId != report.getId()) {
//            throw new IllegalArgumentException("body id differs from parameter id"");
//        }
        // TODO set update date
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
