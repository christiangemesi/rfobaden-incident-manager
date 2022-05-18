package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * {@code TrailerRepository} extends {@link ModelRepository.Basic}.
 * It defines methods with which a {@link Trailer} is accessed in the database
 * additional to the {@link ModelRepository} methods.
 */
@Repository
public interface TrailerRepository
    extends JpaRepository<Trailer, Long>, ModelRepository.Basic<Trailer> {

    /**
     * Loads all visible trailers.
     *
     * @return All trailers whose visibility is true.
     */
    @Query(
        "SELECT trailer"
            + " FROM "
            + "Trailer trailer"
            + " WHERE "
            + "trailer.isVisible = true "
            + "ORDER BY trailer.name"
    )
    List<Trailer> findAllVisible();

    /**
     * Attempts to load a trailer with a specific name.
     *
     * @param name The name of the trailer.
     * @return An {@link Optional} containing the trailer,
     *     or {@link Optional#empty()}, if no matching trailer exists.
     */
    @Query(
        "SELECT trailer"
            + " FROM "
            + "Trailer trailer"
            + " WHERE "
            + "trailer.name = :name"
    )
    Optional<Trailer> findByName(String name);
}
