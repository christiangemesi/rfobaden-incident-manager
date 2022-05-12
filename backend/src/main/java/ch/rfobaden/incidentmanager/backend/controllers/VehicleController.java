package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/vehicles")
public class VehicleController
    extends ModelController.Basic<Vehicle, VehicleService> {

    public VehicleController() {
    }

    @GetMapping("visible")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public List<Vehicle> listVisible() {
        return service.listVisible();
    }

    @Override
    @RequireAgent
    public Vehicle create(@ModelAttribute EmptyPath path, @RequestBody Vehicle entity) {
        var vehicle = service.findByName(entity.getName().toLowerCase()).orElse(null);
        if (vehicle != null) {
            vehicle.setVisible(true);
            return super.update(path, vehicle.getId(), vehicle);
        }
        return super.create(path, entity);
    }

    @Override
    @RequireAgent
    public Vehicle update(
        @ModelAttribute EmptyPath emptyPath,
        @PathVariable Long id,
        @RequestBody Vehicle entity
    ) {
        return super.update(emptyPath, id, entity);
    }

    @Override
    @RequireAgent
    public Vehicle find(@ModelAttribute EmptyPath emptyPath, @PathVariable Long id) {
        return super.find(emptyPath, id);
    }

    @Override
    @RequireAgent
    public List<Vehicle> list(@ModelAttribute EmptyPath emptyPath) {
        return super.list(emptyPath);
    }
}
