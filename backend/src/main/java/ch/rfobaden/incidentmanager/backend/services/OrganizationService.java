package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.repos.OrganizationRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService extends ModelRepositoryService.Basic<Organization, OrganizationRepository>{
}
