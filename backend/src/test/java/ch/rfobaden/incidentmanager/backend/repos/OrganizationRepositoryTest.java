package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class OrganizationRepositoryTest extends ModelRepositoryTest.Basic<Organization, OrganizationRepository>{
}
