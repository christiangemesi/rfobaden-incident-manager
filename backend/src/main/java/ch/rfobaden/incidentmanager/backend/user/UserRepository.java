package ch.rfobaden.incidentmanager.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// This is the data access layer
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
