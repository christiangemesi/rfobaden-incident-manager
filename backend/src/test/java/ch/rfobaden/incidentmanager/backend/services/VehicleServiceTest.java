package ch.rfobaden.incidentmanager.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.VehicleRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class VehicleServiceTest
    extends ModelRepositoryServiceTest.Basic<
    Vehicle,
    VehicleService,
    VehicleRepository> {

    @Test
    void testListWhereIsVisible() {
        // Given
        var records = generator.generate(10);
        Mockito.when(repository.findAllVisible()).thenReturn(records);

        // When
        var result = service.listWhereIsVisible();

        // Then
        assertThat(result).isEqualTo(records);

        verify(repository, times(1)).findAllVisible();
    }

    @Test
    void testFindByName() {
        // Given
        var record = generator.generate();
        Mockito.when(repository.findFirstByName(record.getName()))
            .thenReturn(record);

        // When
        var result = service.findByName(record.getName());

        // Then
        assertThat(result)
            .isNotNull()
            .isEqualTo(record);
        verify(repository, times(1)).findFirstByName(record.getName());
    }
}
