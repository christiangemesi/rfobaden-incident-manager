package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class OrganizationRepositoryTest extends ModelRepositoryTest.Basic<Organization, OrganizationRepository> {

    @Autowired
    OrganizationRepository organizationRepository;

    //TODO again error when in
    //@Override
    protected void saveRelations(User user) {
        var organization = user.getOrganization();
        if (organization != null) {
            user.setOrganization(organizationRepository.save(organization));
        }
    }

}
