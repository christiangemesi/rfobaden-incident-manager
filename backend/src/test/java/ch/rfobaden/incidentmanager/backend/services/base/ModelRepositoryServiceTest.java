package ch.rfobaden.incidentmanager.backend.services.base;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.junit.jupiter.api.Assumptions.assumeFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Import(TestConfig.class)
public abstract class ModelRepositoryServiceTest<
    TModel extends Model & PathConvertible<TPath>,
    TPath,
    TService extends ModelRepositoryService<TModel, TPath, TRepository>,
    TRepository extends JpaRepository<TModel, Long> & ModelRepository<TModel, TPath>
    > {
    @Autowired
    protected TService service;

    @MockBean
    protected TRepository repository;

    @Autowired
    protected ModelGenerator<TModel> generator;

    @RepeatedTest(5)
    public void testList() {
        // Given
        var records = generator.generate(10);
        var path = records.get(0).toPath();
        Mockito.when(repository.findAllByPath(path))
            .thenReturn(records);

        // When
        var result = service.list(path);

        // Then
        assertThat(result).isSameAs(records);
        verify(repository, times(1)).findAllByPath(path);
    }

    @RepeatedTest(5)
    public void testFind() {
        // Given
        var record = generator.generate();
        Mockito.when(repository.findById(record.getId()))
            .thenReturn(Optional.of(record));

        // When
        var result = service.find(record.getId());

        // Then
        assertThat(result)
            .isNotEmpty()
            .containsSame(record);
        verify(repository, times(1)).findById(record.getId());
    }

    @RepeatedTest(5)
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

    @RepeatedTest(5)
    public void testFind_byPath_notFound() {
        // Given
        var record = generator.generate();
        var path = record.toPath();
        Mockito.when(repository.findByPath(path, record.getId()))
            .thenReturn(Optional.empty());

        // When
        var result = service.find(path, record.getId());

        // Then
        assertThat(result).isEmpty();
        verify(repository, times(1)).findByPath(path, record.getId());
    }

    @RepeatedTest(5)
    public void testCreate() {
        // Given
        var newRecord = generator.generateNew();
        var id = generator.generateId();
        var path = newRecord.toPath();
        Mockito.when(repository.save(newRecord))
            .thenAnswer((i) -> {
                var persistedRecord = generator.copy(newRecord);
                persistedRecord.setId(id);
                return persistedRecord;
            });

        // When
        var result = service.create(path, newRecord);

        // Then
        assertThat(result)
            .isNotNull()
            .isNotSameAs(newRecord);
        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getCreatedAt()).isNotNull();
        assertThat(result.getUpdatedAt()).isEqualTo(result.getCreatedAt());
        verify(repository, times(1)).save(newRecord);
    }


    @RepeatedTest(5)
    public void testCreate_presetId() {
        // Given
        var newRecord = generator.generateNew();
        newRecord.setId(generator.generateId());
        var path = newRecord.toPath();

        // When
        var result = catchThrowable(() -> service.create(path, newRecord));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("id will be overwritten and must be null");
        verify(repository, never()).save(newRecord);
    }

    @RepeatedTest(5)
    public void testCreate_presetCreatedAt() {
        // Given
        var newRecord = generator.generateNew();
        newRecord.setCreatedAt(LocalDateTime.now());
        var path = newRecord.toPath();

        // When
        var result = catchThrowable(() -> service.create(path, newRecord));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("createdAt must not be set");
        verify(repository, never()).save(any());
    }

    @RepeatedTest(5)
    public void testCreate_presetUpdatedAt() {
        // Given
        var newRecord = generator.generateNew();
        newRecord.setUpdatedAt(generator.randomDateTime());
        var path = newRecord.toPath();

        // When
        var result = catchThrowable(() -> service.create(path, newRecord));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("updatedAt must not be set");
        verify(repository, never()).save(any());
    }

    @RepeatedTest(5)
    public void testCreate_wrongPath() {
        // Given
        var newRecord = generator.generateNew();
        var path = generator.generateNew().toPath();

        assumeFalse(path.getClass() == EmptyPath.class); // Skip test for models without a path.

        // When
        var result = catchThrowable(() -> service.create(path, newRecord));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(IllegalStateException.class)
            .hasMessage("record does not match path: " + path);
        verify(repository, never()).save(any());
    }

    @RepeatedTest(5)
    public void testUpdate() {
        // Given
        var record = generator.generate();
        var updatedRecord = generator.copy(record);
        var path = record.toPath();

        Mockito.when(repository.findByPath(path, record.getId()))
            .thenReturn(Optional.of(record));
        Mockito.when(repository.save(updatedRecord))
            .thenReturn(updatedRecord);

        // When
        var result = service.update(path, updatedRecord).orElse(null);

        // Then
        assertThat(result)
            .isNotNull()
            .isSameAs(updatedRecord);
        assertThat(result.getCreatedAt()).isEqualTo(record.getCreatedAt());
        assertThat(result.getUpdatedAt()).isAfter(record.getUpdatedAt());
        verify(repository, times(1)).save(updatedRecord);
    }


    @RepeatedTest(5)
    public void testUpdate_notFound() {
        // Given
        var updatedRecord = generator.generate();
        var path = updatedRecord.toPath();

        Mockito.when(repository.findById(updatedRecord.getId()))
            .thenReturn(Optional.empty());

        // When
        var result = service.update(path, updatedRecord);

        // Then
        assertThat(result).isEmpty();
        verify(repository, never()).save(any());
    }

    @RepeatedTest(5)
    public void testUpdate_conflict() {
        // Given
        var record = generator.generate();
        var updatedRecord = generator.copy(record);
        var path = updatedRecord.toPath();
        record.setUpdatedAt(generator.randomDateTime());

        Mockito.when(repository.findByPath(path, record.getId()))
            .thenReturn(Optional.of(record));

        // When
        var result = catchThrowable(() -> service.update(path, updatedRecord));

        // Then
        assertThat(result).isInstanceOf(UpdateConflictException.class);
        verify(repository, never()).save(any());
    }

    @RepeatedTest(5)
    public void testUpdate_updatedAtMissing() {
        // Given
        var record = generator.generate();
        var updatedRecord = generator.copy(record);
        updatedRecord.setUpdatedAt(null);
        var path = updatedRecord.toPath();

        Mockito.when(repository.findByPath(path, record.getId()))
            .thenReturn(Optional.of(record));

        // When
        var result = catchThrowable(() -> service.update(updatedRecord.toPath(), updatedRecord));

        // Then
        assertThat(result)
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("updatedAt must be set");
        verify(repository, never()).save(any());
    }

    @RepeatedTest(5)
    public void testDelete() {
        // Given
        var record = generator.generate();
        var id = record.getId();
        var path = record.toPath();
        Mockito.when(repository.existsByPath(path, id))
            .thenReturn(true);

        // When
        var result = service.delete(path, id);

        // Then
        assertThat(result).isTrue();
        verify(repository, times(1)).existsByPath(path, id);
        verify(repository, times(1)).deleteById(id);
    }

    @RepeatedTest(5)
    public void testDelete_notFound() {
        // Given
        var record = generator.generate();
        var id = record.getId();
        var path = record.toPath();
        Mockito.when(repository.existsByPath(path, id))
            .thenReturn(false);

        // When
        var result = service.delete(path, id);

        // Then
        assertThat(result).isFalse();
        verify(repository, times(1)).existsByPath(path, id);
        verify(repository, never()).deleteById(id);
    }

    public abstract static class Basic<
        TModel extends Model & PathConvertible<EmptyPath>,
        TService extends ModelRepositoryService<TModel, EmptyPath, TRepository>,
        TRepository extends JpaRepository<TModel, Long> & ModelRepository<TModel, EmptyPath>
        > extends ModelRepositoryServiceTest<TModel, EmptyPath, TService, TRepository> {
    }
}
