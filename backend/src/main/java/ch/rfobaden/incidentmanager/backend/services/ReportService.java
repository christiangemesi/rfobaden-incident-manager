package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.EmailConfig;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.ReportRepository;
import ch.rfobaden.incidentmanager.backend.repos.UserRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReportService extends ModelRepositoryService<Report, ReportPath, ReportRepository> {

    private final EmailConfig emailConfig;

    private final UserRepository userRepository;

    public ReportService(EmailConfig emailConfig, UserRepository userRepository) {
        super();
        this.emailConfig = emailConfig;
        this.userRepository = userRepository;
    }

    @Override
    public Report create(ReportPath path, Report report) {
        Report savedReport = super.create(path, report);
        if (savedReport.getAssignee() != null) {
            sendAssignmentEmail(savedReport);
        }
        return savedReport;
    }

    @Override
    public Optional<Report> update(ReportPath path, Report report) {
        Optional<Report> oldReport = repository.findById(report.getId());
        if (oldReport.isEmpty()) {
            return Optional.empty();
        }
        Long oldReportId = oldReport.get().getAssigneeId();
        Optional<Report> savedReport = super.update(path, report);
        savedReport.ifPresent(rep -> {
            if (rep.getAssigneeId() != null
                && !rep.getAssigneeId().equals(oldReportId)) {
                sendAssignmentEmail(rep);
            }
        });
        return savedReport;
    }

    private void sendAssignmentEmail(Report report) {
        // Ereignis/Meldung
        String info = report.getIncident().getTitle()
            + "/" + report.getTitle();
        // {host}/ereignisse/{incident-id}/meldungen/{report-id}
        String link = "ereignisse/" + report.getIncident().getId()
            + "/meldungen/" + report.getId();
        emailConfig.sendSimpleMessage(report.getAssignee().getEmail(),
            "IM-Tool RFOBaden: Zuweisung",
            emailConfig.getAssignmentTemplateMessage(info, link));
    }
}
