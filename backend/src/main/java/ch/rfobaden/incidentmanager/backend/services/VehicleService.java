package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.VehicleRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService
    extends ModelRepositoryService.Basic<Vehicle, VehicleRepository> {

    public List<Vehicle> listWhereIsVisible() {
        return repository.findAllVisible();
    }

    public Vehicle findByName(String name) {
        return repository.findFirstByName(name);
    }
}
