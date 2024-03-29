package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * {@code TransportRepository} is a {@link ModelRepository} for {@link Transport transports}.
 */
@Repository
public interface TransportRepository
    extends JpaRepository<Transport, Long>, ModelRepository<Transport, TransportPath> {

    @Query(
        "SELECT CASE WHEN COUNT(transport) > 0 THEN true ELSE false END"
            + " FROM "
            + "Transport transport"
            + " WHERE "
            + "transport.incident.id = :#{#path.incidentId}"
            + " AND "
            + "transport.id = :id"
    )
    @Override
    boolean existsByPath(@Param("path") TransportPath path, @Param("id") Long id);

    @Query(
        "SELECT transport"
            + " FROM "
            + "Transport transport"
            + " WHERE "
            + "transport.incident.id = :#{#path.incidentId}"
            + " AND "
            + "transport.id = :id"
    )
    @Override
    Optional<Transport> findByPath(@Param("path") TransportPath path, @Param("id") Long id);

    @Query(
        "SELECT transport"
            + " FROM "
            + "Transport transport"
            + " WHERE "
            + "transport.incident.id = :#{#path.incidentId}"
    )
    @Override
    List<Transport> findAllByPath(@Param("path") TransportPath path);

    /**
     * Loads all assigned {@link Transport transports} over all opened {@link Incident incidents}.
     *
     * @param id The id of the {@link User assignee}.
     * @return The list of assigned transports.
     */
    @Query(
        "SELECT transport"
            + " FROM "
            + "Transport transport"
            + " WHERE "
            + "transport.assignee.id = :id"
            + " AND "
            + "transport.incident.isClosed = false "
            + "ORDER BY transport.incident.id"
    )
    List<Transport> findAllByAssigneeId(@Param("id") Long id);
}
