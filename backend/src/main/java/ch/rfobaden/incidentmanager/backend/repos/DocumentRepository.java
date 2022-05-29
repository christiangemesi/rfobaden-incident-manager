package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * {@code DocumentRepository} allows access to {@link Document} instances stored in the database.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
}
