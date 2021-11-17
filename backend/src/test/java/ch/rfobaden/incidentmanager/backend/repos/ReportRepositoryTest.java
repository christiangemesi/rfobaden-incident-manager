package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

@DataJpaTest
public class ReportRepositoryTest {

    @Autowired
    private ReportRepository reportRepository;

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
        var authorId = 42L;
        var description = "This is a awesome description";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();
        Incident incident = new Incident(1L, "title", 0L);

        // When
        var data = new Report();
        data.setTitle(title);
//        data.setIncident(incident);
        data.setAuthorId(authorId);
        data.setDescription(description);
        data.setCreatedAt(createdAt);
        data.setUpdatedAt(updatedAt);
        Report report = reportRepository.save(data);

        // Then
        assertThat(report.getId()).isPositive();
        assertThat(report.getTitle()).isEqualTo(title);
        assertThat(report.getAuthorId()).isEqualTo(authorId);
        assertThat(report.getDescription()).isEqualTo(description);
        assertThat(report.getCreatedAt()).isEqualTo(createdAt);
        assertThat(report.getUpdatedAt()).isEqualTo(updatedAt);
    }

    @Test
    public void testGetReports() {
        // Given
        Report report1 = reportRepository.save(new Report(1L, "Report Title 1", 11L));
        Report report2 = reportRepository.save(new Report(2L, "Report Title 2", 22L));
        Report report3 = reportRepository.save(new Report(3L, "Report Title 3", 33L));

        // When
        List<Report> reports = reportRepository.findAll();

        // Then
        assertThat(reports).hasSize(3).contains(report1, report2, report3);
    }

    @Test
    public void testGetReportById() {
        // Given
        reportRepository.save(new Report(1L, "Report Title 1", 42L));
        Report report2 = reportRepository.save(new Report(1L, "Report Title 1", 81L));

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
        Report report1 = reportRepository.save(new Report(1L, "Report Title 1", 11L));
        Report report2 = reportRepository.save(new Report(2L, "Report Title 2", 22L));
        Report report3 = reportRepository.save(new Report(3L, "Report Title 3", 33L));

        // When
        reportRepository.deleteById(report2.getId());

        // Then
        assertThat(reportRepository.findAll()).hasSize(2).contains(report1, report3);
    }
}
