package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.services.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
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
    public List<Vehicle> listAllVisible() {
        return service.listWhereIsVisible();
    }
}
