package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.ReportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ReportServiceTest extends
    ModelRepositoryServiceTest<Report, ReportPath, ReportService, ReportRepository> {
}
