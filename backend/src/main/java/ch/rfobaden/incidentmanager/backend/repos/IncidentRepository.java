package ch.rfobaden.incidentmanager.backend.repos;


import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * {@code IncidentRepository} is a {@link ModelRepository} for {@link Incident incidents}.
 */
@Repository
public interface IncidentRepository extends
    JpaRepository<Incident, Long>, ModelRepository.Basic<Incident> {

    /**
     * Paginates all closed incidents.
     *
     * @param pageable The pagination state.
     * @return The {@link Page} described by {@code pageable}.
     */
    @Query(
        "SELECT incident"
            + " FROM "
            + "Incident incident"
            + " WHERE "
            + "incident.isClosed = true"
            + " ORDER BY "
            + "incident.closeReason.createdAt DESC"
    )
    Page<Incident> findAllClosed(Pageable pageable);
}
