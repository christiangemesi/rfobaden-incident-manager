package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

import java.util.List;

@TestComponent
public class UserGenerator extends ModelGenerator<User> {
    @Autowired
    UserCredentialsGenerator credentialsGenerator;

    @Autowired
    OrganizationGenerator organizationGenerator;

    @Override
    public User generateNew() {
        User user = generateNewWithoutOrganization();
        user.setOrganization(organizationGenerator.generate());
        user.getOrganization().setUsers(List.of());
        return user;
    }

    public User generateNewWithoutOrganization() {
        var user = new User();
        user.setFirstName(faker.name().firstName());
        user.setLastName(faker.name().lastName());
        user.setEmail(faker.internet().emailAddress());
        user.setRole(faker.options().option(User.Role.class));
        return user;
    }


    @Override
    public User persist(User user) {
        user = super.persist(user);
        user.setCredentials(credentialsGenerator.generate());
        user.getCredentials().setUser(user);

        if (user.getOrganization() != null) {
            user.setOrganization(organizationGenerator.persist(user.getOrganization()));
        }

        return user;
    }
}
