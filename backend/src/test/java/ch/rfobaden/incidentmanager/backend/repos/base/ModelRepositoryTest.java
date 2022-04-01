package ch.rfobaden.incidentmanager.backend.repos.base;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.junit.jupiter.api.RepeatedTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDateTime;

@Import(TestConfig.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public abstract class ModelRepositoryTest<
    TModel extends Model & PathConvertible<TPath>,
    TPath,
    TRepository extends ModelRepository<TModel, TPath> & JpaRepository<TModel, Long>
    > {
    @Autowired
    protected TRepository repository;

    @Autowired
    protected ModelGenerator<TModel> generator;

    @Autowired
    private ApplicationContext applicationContext;

    @RepeatedTest(5)
    public void testFindAll() {
        // Given
        var records = generator.generate(10);
        records.forEach(this::saveRelations);
        records = repository.saveAll(records);

        // When
        var result = repository.findAll();

        // Then
        assertThat(result).asList().containsExactlyInAnyOrderElementsOf(records);
    }


    @RepeatedTest(5)
    public void testFindAll_empty() {
        // When
        var result = repository.findAll();

        // Then
        assertThat(result).asList().isEmpty();
    }

    @RepeatedTest(5)
    public void testFindById() {
        // Given
        var record = saveWithRelations(generator.generate());

        // When
        var result = repository.findById(record.getId()).orElse(null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(record);
    }

    @RepeatedTest(5)
    public void testFindById_notFound() {
        // Given
        var id = generator.generateId();

        // When
        var result = repository.findById(id);

        // Then
        assertThat(result).isEmpty();
    }

    @RepeatedTest(5)
    public void testSave_create() {
        // Given
        var record = generator.generate();
        saveRelations(record);

        // When
        var result = repository.save(record);
        record.setId(result.getId());
        alignAfterCreate(record, result);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(record);
    }

    @RepeatedTest(5)
    public void testSave_update() {
        // Given
        var newRecord = generator.generate();
        var createdRecord = saveWithRelations(generator.copy(newRecord));
        var editedRecord = generator.copy(createdRecord);
        editedRecord.setUpdatedAt(generator.randomDateTime());

        // When
        var updatedRecord = repository.save(editedRecord);

        // Then
        assertThat(repository.findById(createdRecord.getId()).orElse(null))
            .isEqualTo(updatedRecord);
    }

    @RepeatedTest(5)
    public void testDeleteById() {
        // Given
        var record = generator.generate();
        record = saveWithRelations(record);

        // When
        repository.deleteById(record.getId());
        var result = repository.findById(record.getId()).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @RepeatedTest(5)
    public void testDeleteById_notFound() {
        // Given
        var id = generator.generateId();

        // When
        var result = catchThrowable(() -> repository.deleteById(id));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(EmptyResultDataAccessException.class);
    }

    private TModel saveWithRelations(TModel record) {
        saveRelations(record);
        return repository.save(record);
    }

    protected void saveRelations(TModel record) {}

    protected void alignAfterCreate(TModel record, TModel result) {}

    public abstract static class Basic<
        TModel extends Model & PathConvertible<EmptyPath>,
        TRepository extends ModelRepository<TModel, EmptyPath> & JpaRepository<TModel, Long>
        > extends ModelRepositoryTest<TModel, EmptyPath, TRepository> {
    }
}
