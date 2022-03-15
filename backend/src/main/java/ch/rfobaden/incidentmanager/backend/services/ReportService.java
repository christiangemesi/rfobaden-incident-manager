package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.EmailConfig;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.ReportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

@Service
public class ReportService extends ModelRepositoryService<Report, ReportPath, ReportRepository> {

    private final EmailConfig emailConfig;

    public ReportService(EmailConfig emailConfig) {
        super();
        this.emailConfig = emailConfig;
    }

    @Override
    public Report create(ReportPath path, Report report) {
        Report savedReport = super.create(path, report);
        if (savedReport.getAssignee() != null) {
            // Ereignis/Meldung
            String info = savedReport.getIncident().getTitle()
                + "/" + savedReport.getTitle();
            // {host}/ereignisse/{incident-id}/meldungen/{report-id}
            String link = "ereignisse/" + savedReport.getIncident().getId()
                + "/meldungen/" + savedReport.getId();
            emailConfig.sendSimpleMessage(savedReport.getAssignee().getEmail(),
                "IM-Tool RFOBaden: Zuweisung",
                emailConfig.getAssignedTemplateMessage(info, link));
        }
        return savedReport;
    }
}
