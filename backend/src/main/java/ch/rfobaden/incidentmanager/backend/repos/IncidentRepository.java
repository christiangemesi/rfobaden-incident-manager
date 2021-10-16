package ch.rfobaden.incidentmanager.backend.repos;


import ch.rfobaden.incidentmanager.backend.models.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * This is the data access layer of the N-Tier pattern.
 */
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    //todo is title correct?
    @Query("SELECT incident FROM Incident incident WHERE LOWER(incident.title) = LOWER(:title)")
    Optional<Incident> findOneByName(@Param("title") String title);
}
