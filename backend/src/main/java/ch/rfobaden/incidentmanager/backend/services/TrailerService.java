package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.repos.TrailerRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * {@code TrailerService} is a {@link ModelRepositoryService.Basic} that
 * accesses the {@link TrailerRepository} methods.
 */
@Service
public class TrailerService
    extends ModelRepositoryService.Basic<Trailer, TrailerRepository> {

    /**
     * Loads all trailers whose visibility is true.
     *
     * @return Visible trailers.
     */
    public List<Trailer> listVisible() {
        return repository.findAllVisible();
    }

    /**
     * Attempts to load a trailer with a specific name.
     *
     * @param name The name of the trailer.
     * @return An {@link Optional} containing the trailer,
     *     or {@link Optional#empty()}, if no matching trailer exists.
     */
    public Optional<Trailer> findByName(String name) {
        return repository.findByName(name);
    }
}
