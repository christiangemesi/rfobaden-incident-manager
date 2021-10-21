package ch.rfobaden.incidentmanager.backend.repos;


import ch.rfobaden.incidentmanager.backend.models.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

}
