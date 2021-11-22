package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT count(user) FROM User user WHERE LOWER(user.email) = LOWER(:email)")
    long countByEmail(@Param("email") String email);

    @Query("SELECT user FROM User user WHERE LOWER(user.email) = LOWER(:email)")
    Optional<User> findByEmail(@Param("email") String email);
}
