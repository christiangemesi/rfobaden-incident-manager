package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.services.OrganizationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/organizations")
public class OrganizationController extends ModelController.Basic<Organization, OrganizationService> {


}
