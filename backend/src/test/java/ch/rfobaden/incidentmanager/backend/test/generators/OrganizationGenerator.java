package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

import java.util.List;
import java.util.stream.Collectors;

@TestComponent
public class OrganizationGenerator extends ModelGenerator<Organization> {

    @Autowired
    UserGenerator userGenerator;

    @Override
    public Organization generateNew() {
        var organization = new Organization();
        organization.setName(faker.name().name());
        organization.setUsers(List.of(
            userGenerator.generateNewWithoutOrganization(),
            userGenerator.generateNewWithoutOrganization(),
            userGenerator.generateNewWithoutOrganization()
        ));
        organization.setEmail(faker.internet().emailAddress());
        return organization;
    }
}