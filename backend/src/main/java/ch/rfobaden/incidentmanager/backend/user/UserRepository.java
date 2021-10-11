package ch.rfobaden.incidentmanager.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * This is the data access layer of the N-Tier pattern.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT user FROM User user WHERE LOWER(user.username) = LOWER(:name)")
    Optional<User> findOneByName(@Param("name") String name);
}
