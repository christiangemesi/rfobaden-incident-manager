package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT report FROM Report report "
            + "WHERE report.id = :id AND report.incident.id = :incidentId")
    Optional<Report> findByIdOfIncident(
            @Param("incidentId") Long incidentId, @Param("id") Long id
    );

    @Query("SELECT report FROM Report report WHERE report.incident.id = :incidentId")
    List<Report> findAllOfIncident(@Param("incidentId") Long incidentId);
}
