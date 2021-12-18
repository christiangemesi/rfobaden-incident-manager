package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@DataJpaTest
public class OrganizationRepositoryTest extends ModelRepositoryTest.Basic<Organization, OrganizationRepository> {

    @Autowired
    UserRepository userRepository;

    @Override
    protected void saveRelations(Organization organization) {
        List<User> users = new ArrayList<>();
        for (User user : organization.getUsers()) {
            System.out.println(user);
            users.add(userRepository.save(user));
        }
        organization.setUsers(users);
    }
}