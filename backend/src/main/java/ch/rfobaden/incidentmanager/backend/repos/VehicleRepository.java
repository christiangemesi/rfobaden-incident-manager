package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository
    extends JpaRepository<Vehicle, Long>, ModelRepository.Basic<Vehicle> {
    @Query(
        "SELECT vehicle"
            + " FROM "
            + "Vehicle vehicle"
            + " WHERE "
            + "vehicle.isVisible = true "
            + "ORDER BY vehicle.name"
    )
    List<Vehicle> findAllVisible();

    @Query(
        "SELECT vehicle"
            + " FROM "
            + "Vehicle vehicle"
            + " WHERE "
            + "vehicle.name = :name"
    )
    Optional<Vehicle> findByName(String name);
}
