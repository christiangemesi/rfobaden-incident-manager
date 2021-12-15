package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class OrganizationGenerator extends ModelGenerator<Organization> {

    @Override
    public Organization generateNew() {
        var organization = new Organization();
        organization.setName(faker.name().name());
        organization.setEmail(faker.internet().emailAddress());

        return organization;
    }
}
