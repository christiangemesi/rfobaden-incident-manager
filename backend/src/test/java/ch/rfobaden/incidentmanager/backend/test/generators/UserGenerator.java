package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class UserGenerator extends ModelGenerator<User> {
    @Autowired
    UserCredentialsGenerator credentialsGenerator;

    @Autowired
    OrganizationGenerator organizationGenerator;

    @Override
    public User generateNew() {
        var user = new User();
        user.setFirstName(faker.name().firstName());
        user.setLastName(faker.name().lastName());
        user.setEmail(faker.internet().emailAddress());
        user.setRole(faker.options().option(User.Role.class));
        user.setOrganization(organizationGenerator.generate());
        return user;
    }

    @Override
    public User persist(User user) {
        var persistedUser = super.persist(user);
        persistedUser.setCredentials(credentialsGenerator.generate());
        persistedUser.getCredentials().setUser(persistedUser);
        return persistedUser;
    }
}
