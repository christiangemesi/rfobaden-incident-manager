package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * {@code UserRepository} is a {@link ModelRepository} for {@link User users}.
 */
@Repository
public interface UserRepository extends ModelRepository.Basic<User>, JpaRepository<User, Long> {
    /**
     * Counts all users that have a specific email.
     *
     * @param email The email to match.
     * @return The amount of matched users.
     */
    @Query("SELECT count(user) FROM User user WHERE LOWER(user.email) = LOWER(:email)")
    long countByEmail(@Param("email") String email);

    /**
     * Attempts to load a user that has a specific email.
     *
     * @param email The email to match.
     * @return An {@link Optional} containing the user,
     *         or {@link Optional#empty()}, if no matching user exists.
     */
    @Query("SELECT user FROM User user WHERE LOWER(user.email) = LOWER(:email)")
    Optional<User> findByEmail(@Param("email") String email);
}
