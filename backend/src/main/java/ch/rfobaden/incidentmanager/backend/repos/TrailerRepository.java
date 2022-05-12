package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TrailerRepository
    extends JpaRepository<Trailer, Long>, ModelRepository.Basic<Trailer> {

    @Query(
        "SELECT trailer"
            + " FROM "
            + "Trailer trailer"
            + " WHERE "
            + "trailer.isVisible = true "
            + "ORDER BY trailer.name"
    )
    List<Trailer> findAllVisible();

    @Query(
        "SELECT trailer"
            + " FROM "
            + "Trailer trailer"
            + " WHERE "
            + "trailer.name = :name"
    )
    Optional<Trailer> findByName(String name);
}
