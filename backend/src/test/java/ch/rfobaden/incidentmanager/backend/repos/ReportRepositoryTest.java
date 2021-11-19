package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@DataJpaTest
public class ReportRepositoryTest {

    @Autowired
    private ReportRepository reportRepository;

    @MockBean
    private IncidentService incidentService;

    private final Incident incident = new Incident();
    private final User author = new User();

    @Test
    public void testRepositoryIsEmpty() {
        // Given
        List<Report> reports = reportRepository.findAll();

        // Then
        assertThat(reports).isEmpty();
    }

    @Test
    public void testAddReport() {
        // Given
        var title = "Report Title";
        var author = new User();
        var description = "This is a awesome description";
        
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        var incident = new Incident(1L, "incident title", 1L);
        Mockito.when(incidentService.getIncidentById(incident.getId()))
                .thenReturn(Optional.of(incident));

        // When
        var data = new Report();
        data.setTitle(title);
        data.setIncident(incident);
        data.setAuthor(author);
        data.setDescription(description);
        data.setCreatedAt(createdAt);
        data.setUpdatedAt(updatedAt);
        Report report = reportRepository.save(data);

        // Then
        assertThat(report.getId()).isPositive();
        assertThat(report.getTitle()).isEqualTo(title);
        assertThat(report.getAuthor()).isEqualTo(author);
        assertThat(report.getDescription()).isEqualTo(description);
        assertThat(report.getCreatedAt()).isEqualTo(createdAt);
        assertThat(report.getUpdatedAt()).isEqualTo(updatedAt);
    }

    @Test
    public void testGetReports() {
        // Given
        Report report1 = reportRepository.save(new Report(1L, "Report Title 1", author, incident));
        Report report2 = reportRepository.save(new Report(2L, "Report Title 2", author, incident));
        Report report3 = reportRepository.save(new Report(3L, "Report Title 3", author, incident));

        // When
        List<Report> reports = reportRepository.findAll();

        // Then
        assertThat(reports).hasSize(3);//.contains(report1, report2, report3);
    }

    @Test
    public void testGetReportById() {
        // Given
        reportRepository.save(new Report(1L, "Report Title 1", author, incident));
        Report report2 = reportRepository.save(new Report(2L, "Report Title 1", author, incident));

        // When
        Report report = reportRepository.findById(report2.getId()).orElse(null);

        // Then
        assertThat(report)
                .isNotNull()
                .isEqualTo(report2);
    }

    @Test
    public void testDeleteReportById() {
        // Given
        Report report1 = reportRepository.save(new Report(1L, "Report Title 1", author, incident));
        Report report2 = reportRepository.save(new Report(2L, "Report Title 2", author, incident));
        Report report3 = reportRepository.save(new Report(3L, "Report Title 3", author, incident));

        // When
        reportRepository.deleteById(report2.getId());

        // Then
        assertThat(reportRepository.findAll()).hasSize(2).contains(report1, report3);
    }
}
