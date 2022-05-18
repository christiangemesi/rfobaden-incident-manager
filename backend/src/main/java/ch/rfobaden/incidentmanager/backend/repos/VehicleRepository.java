package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * {@code VehicleRepository} is a {@link ModelRepository} for {@link Vehicle vehicles}.
 */
@Repository
public interface VehicleRepository
    extends JpaRepository<Vehicle, Long>, ModelRepository.Basic<Vehicle> {

    /**
     * Loads all {@link Vehicle#isVisible() visible} vehicles.
     *
     * @return All visible vehicles.
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
     * @return An {@link Optional} containing the vehicle,
     *     or {@link Optional#empty()}, if no matching vehicle exists.
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
