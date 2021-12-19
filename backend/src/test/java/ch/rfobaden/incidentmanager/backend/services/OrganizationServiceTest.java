package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.repos.OrganizationRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class OrganizationServiceTest
    extends ModelRepositoryServiceTest.Basic<
    Organization,
    OrganizationService,
    OrganizationRepository> {
}
