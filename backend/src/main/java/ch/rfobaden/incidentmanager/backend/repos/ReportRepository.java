package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT report FROM Report report "
            + "WHERE report.id = :id AND report.incident.id = :incidentId")
    Optional<Report> findByIncidentIdAndId(
            @Param("incidentId") Long incidentId, @Param("id") Long id
    );
}
