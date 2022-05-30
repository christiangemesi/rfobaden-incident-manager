package ch.rfobaden.incidentmanager.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.repos.TrailerRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

@SpringBootTest
class TrailerServiceTest extends ModelRepositoryServiceTest.Basic<
    Trailer,
    TrailerService,
    TrailerRepository> {

    @Test
    void testListVisible() {
        // Given
        var records = generator.generate(10);
        Mockito.when(repository.findAllVisible()).thenReturn(records);

        // When
        var result = service.listVisible();

        // Then
        assertThat(result).isEqualTo(records);

        verify(repository, times(1)).findAllVisible();
    }

    @Test
    void testFindByName() {
        // Given
        var record = generator.generate();

        Mockito.when(repository.findByName(record.getName()))
            .thenReturn(Optional.of(record));

        // When
        var result = service.findByName(record.getName());

        // Then
        assertThat(result)
            .isNotNull()
            .isEqualTo(Optional.of(record));
        verify(repository, times(1)).findByName(record.getName());
    }
}
