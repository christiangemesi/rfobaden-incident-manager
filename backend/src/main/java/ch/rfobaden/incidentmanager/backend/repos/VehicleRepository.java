package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * {@code ModelRepository} defines methods with which a {@link Vehicle} is accessed in the database
 * additional to the {@link ch.rfobaden.incidentmanager.backend.models.Model} methods.
 */
@Repository
public interface VehicleRepository
    extends JpaRepository<Vehicle, Long>, ModelRepository.Basic<Vehicle> {

    /**
     * Loads all entities at a given path.
     *
     * @return All entities whose visibility is true.
     */
    @Query(
        "SELECT vehicle"
            + " FROM "
            + "Vehicle vehicle"
            + " WHERE "
            + "vehicle.isVisible = true "
            + "ORDER BY vehicle.name"
    )
    List<Vehicle> findAllVisible();

    /**
     * Attempts to load a vehicle with a specific name.
     *
     * @param name The name of the vehicle.
     * @return An {@link Optional} containing the entity,
     *     or {@link Optional#empty()}, if no matching entity exists.
     */
    @Query(
        "SELECT vehicle"
            + " FROM "
            + "Vehicle vehicle"
            + " WHERE "
            + "vehicle.name = :name"
    )
    Optional<Vehicle> findByName(String name);
}
