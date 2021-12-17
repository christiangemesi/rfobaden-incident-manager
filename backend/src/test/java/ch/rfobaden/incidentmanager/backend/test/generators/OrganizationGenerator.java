package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class OrganizationGenerator extends ModelGenerator<Organization> {
    @Autowired
    OrganizationGenerator organizationGenerator;


    @Override
    public Organization generateNew() {
        var organization = new Organization();
        User user = new User();
        organization.setName(faker.name().name());
        user.setOrganization(organizationGenerator.generate());
        organization.setEmail(faker.internet().emailAddress());

        return organization;
    }
}
