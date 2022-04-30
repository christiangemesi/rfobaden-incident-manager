package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.TransportPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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

    @Query(
        "SELECT transport"
            + " FROM "
            + "Transport transport"
            + " WHERE "
            + "transport.assignee.id = :id"
            + " AND "
            + "transport.incident.isClosed = false"
    )
    List<Transport> findAllByAssigneeId(@Param("id") Long id);
}
