package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.repos.OrganizationRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import org.springframework.stereotype.Service;

/**
 * {@code OrganizationService} is a {@link ModelService} for {@link Organization organizations}.
 */
@Service
public class OrganizationService
    extends ModelRepositoryService.Basic<Organization, OrganizationRepository> {

}
