package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository
    extends JpaRepository<Vehicle, Long>, ModelRepository.Basic<Vehicle> {
    @Query(
        "SELECT vehicle"
            + " FROM "
            + "Vehicle vehicle"
            + " WHERE "
            + "vehicle.isVisible = TRUE "
            + "ORDER BY vehicle.name"
    )
    List<Vehicle> findAllVisible();
}
