package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.VehicleRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService
    extends ModelRepositoryService.Basic<Vehicle, VehicleRepository> {

    public List<Vehicle> listVisible() {
        return repository.findAllVisible();
    }

    public Optional<Vehicle> findByName(String name) {
        return repository.findByName(name);
    }
}