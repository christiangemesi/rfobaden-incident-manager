package ch.rfobaden.incidentmanager.backend.services.base;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Import(TestConfig.class)
public abstract class ModelRepositoryServiceTest<
    TService extends ModelRepositoryService<TModel, TRepository>,
    TModel extends Model,
    TRepository extends JpaRepository<TModel, Long>
    > {
    @Autowired
    protected TService service;

    @MockBean
    protected TRepository repository;

    @Autowired
    protected ModelGenerator<TModel> generator;

    @Test
    public void testList() {
        // Given
        var records = generator.generatePersisted(10);
        Mockito.when(repository.findAll())
            .thenReturn(records);

        // When
        var result = service.list();

        // Then
        assertThat(result).isSameAs(records);
        verify(repository, times(1)).findAll();
    }

    @Test
    public void testFind() {
        // Given
        var record = generator.generatePersisted();
        Mockito.when(repository.findById(record.getId()))
            .thenReturn(Optional.of(record));

        // When
        var result = service.find(record.getId());

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result.get()).isSameAs(record);
        verify(repository, times(1)).findById(record.getId());
    }

    @Test
    public void testFind_notFound() {
        // Given
        var id = generator.generateId();
        Mockito.when(repository.findById(id))
            .thenReturn(Optional.empty());

        // When
        var result = service.find(id);

        // Then
        assertThat(result).isEmpty();
        verify(repository, times(1)).findById(id);
    }

    @Test
    public void testCreate() {
        // Given
        var newRecord = generator.generateNew();
        var id = generator.generateId();
        Mockito.when(repository.save(newRecord))
            .thenAnswer((i) -> {
                var persistedRecord = generator.copy(newRecord);
                persistedRecord.setId(id);
                return persistedRecord;
            });

        // When
        var result = service.create(newRecord);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isNotSameAs(newRecord);
        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getCreatedAt()).isNotNull();
        assertThat(result.getUpdatedAt()).isEqualTo(result.getCreatedAt());
        verify(repository, times(1)).save(newRecord);
    }


    @Test
    public void testCreate_presetId() {
        // Given
        var newRecord = generator.generateNew();
        newRecord.setId(generator.generateId());

        // When
        var result = catchThrowable(() -> service.create(newRecord));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("id will be overwritten and must be null");
        verify(repository, never()).save(newRecord);
    }

    @Test
    public void testCreate_presetCreatedAt() {
        // Given
        var newRecord = generator.generateNew();
        newRecord.setCreatedAt(LocalDateTime.now());

        // When
        var result = catchThrowable(() -> service.create(newRecord));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("createdAt must not be set");
        verify(repository, never()).save(any());
    }

    @Test
    public void testCreate_presetUpdatedAt() {
        // Given
        var newRecord = generator.generateNew();
        newRecord.setUpdatedAt(LocalDateTime.now());

        // When
        var result = catchThrowable(() -> service.create(newRecord));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("updatedAt must not be set");
        verify(repository, never()).save(any());
    }

    @Test
    public void testUpdate() {
        // Given
        var record = generator.generatePersisted();
        var updatedRecord = generator.copy(record);

        Mockito.when(repository.findById(record.getId()))
            .thenReturn(Optional.of(record));
        Mockito.when(repository.save(updatedRecord))
            .thenReturn(updatedRecord);

        // When
        var result = service.update(updatedRecord).orElse(null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isSameAs(updatedRecord);
        assertThat(result.getCreatedAt()).isEqualTo(record.getCreatedAt());
        assertThat(result.getUpdatedAt()).isAfter(record.getUpdatedAt());
        verify(repository, times(1)).save(updatedRecord);
    }


    @Test
    public void testUpdate_notFound() {
        // Given
        var updatedRecord = generator.generatePersisted();
        Mockito.when(repository.findById(updatedRecord.getId()))
            .thenReturn(Optional.empty());

        // When
        var result = service.update(updatedRecord);

        // Then
        assertThat(result).isEmpty();
        verify(repository, never()).save(any());
    }

    @Test
    public void testUpdate_conflict() {
        // Given
        var record = generator.generatePersisted();
        var updatedRecord = generator.copy(record);
        record.setUpdatedAt(LocalDateTime.now());

        Mockito.when(repository.findById(record.getId()))
            .thenReturn(Optional.of(record));

        // When
        var result = catchThrowable(() -> service.update(updatedRecord));

        // Then
        assertThat(result)
            .isInstanceOf(UpdateConflictException.class);
        verify(repository, never()).save(any());
    }

    @Test
    public void testUpdate_updatedAtMissing() {
        // Given
        var record = generator.generatePersisted();
        var updatedRecord = generator.copy(record);
        updatedRecord.setUpdatedAt(null);

        Mockito.when(repository.findById(record.getId()))
            .thenReturn(Optional.of(record));

        // When
        var result = catchThrowable(() -> service.update(updatedRecord));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("updatedAt must be set");
        verify(repository, never()).save(any());
    }

    @Test
    public void testDelete() {
        // Given
        var id = generator.generateId();
        Mockito.when(repository.existsById(id))
            .thenReturn(true);

        // When
        var result = service.delete(id);

        // Then
        assertThat(result).isTrue();
        verify(repository, times(1)).existsById(id);
        verify(repository, times(1)).deleteById(id);
    }

    @Test
    public void testDelete_notFound() {
        // Given
        var id = generator.generateId();
        Mockito.when(repository.existsById(id))
            .thenReturn(false);

        // When
        var result = service.delete(id);

        // Then
        assertThat(result).isFalse();
        verify(repository, times(1)).existsById(id);
        verify(repository, never()).deleteById(id);
    }
}
