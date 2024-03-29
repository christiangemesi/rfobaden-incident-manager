package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * {@code OrganizationRepository} is a {@link ModelRepository}
 * for {@link Organization organizations}.
 */
@Repository
public interface OrganizationRepository
    extends JpaRepository<Organization, Long>, ModelRepository.Basic<Organization> {

}
