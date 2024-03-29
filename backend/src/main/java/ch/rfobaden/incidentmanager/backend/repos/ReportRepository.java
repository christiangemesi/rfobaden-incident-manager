package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * {@code ReportRepository} is a {@link ModelRepository} for {@link Report reports}.
 */
@Repository
public interface ReportRepository
    extends JpaRepository<Report, Long>, ModelRepository<Report, ReportPath> {
    @Query(
        "SELECT CASE WHEN COUNT(report) > 0 THEN true ELSE false END"
            + " FROM "
            + "Report report"
            + " WHERE "
            + "report.incident.id = :#{#path.incidentId}"
            + " AND "
            + "report.id = :id"
    )
    @Override
    boolean existsByPath(@Param("path") ReportPath path, @Param("id") Long id);

    @Query(
        "SELECT report"
            + " FROM "
            + "Report report"
            + " WHERE "
            + "report.incident.id = :#{#path.incidentId}"
            + " AND "
            + "report.id = :id"
    )
    @Override
    Optional<Report> findByPath(@Param("path") ReportPath path, @Param("id") Long id);

    @Query(
        "SELECT report"
            + " FROM "
            + "Report report"
            + " WHERE "
            + "report.incident.id = :#{#path.incidentId}"
    )
    @Override
    List<Report> findAllByPath(@Param("path") ReportPath path);

    /**
     * Loads all assigned {@link Report reports} over all opened {@link Incident incidents}.
     *
     * @param id The id of the {@link User assignee}.
     * @return The list of assigned reports.
     */
    @Query(
        "SELECT report"
            + " FROM "
            + "Report report"
            + " WHERE "
            + "report.assignee.id = :id"
            + " AND "
            + "report.incident.isClosed = false "
            + "ORDER BY report.incident.id"
    )
    List<Report> findAllByAssigneeId(@Param("id") Long id);
}
