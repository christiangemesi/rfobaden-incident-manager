package ch.rfobaden.incidentmanager.backend.repos.base;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;

@Import(TestConfig.class)
public abstract class ModelRepositoryTest<
    TModel extends Model,
    TRepository extends JpaRepository<TModel, Long>
    > {

    @Autowired
    protected TRepository repository;

    @Autowired
    protected ModelGenerator<TModel> generator;

    @BeforeEach
    public void setup() {
        repository.deleteAll();
    }

    @Test
    public void testFindAll() {
        // Given
        var records = generator.generatePersisted(10);
        records = repository.saveAll(records);

        // When
        var result = repository.findAll();

        // Then
        assertThat(result).asList().containsExactlyInAnyOrderElementsOf(records);
    }


    @Test
    public void testFindAll_empty() {
        // When
        var result = repository.findAll();

        // Then
        assertThat(result).asList().isEmpty();
    }

    @Test
    public void testFindById() {
        // Given
        var record = repository.save(generator.generatePersisted());


        // When
        var result = repository.findById(record.getId()).orElse(null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(record);
    }

    @Test
    public void testFindById_notFound() {
        // Given
        var id = generator.generateId();


        // When
        var result = repository.findById(id);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    public void testSave_create() {
        // Given
        var record = generator.generatePersisted();

        // When
        var result = repository.save(record);
        record.setId(result.getId());

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(record);
    }

    @Test
    public void testSave_update() {
        // Given
        var record1 = generator.generatePersisted();
        var record2 = generator.generatePersisted();

        // When
        var result1 = repository.save(record1);
        record1.setId(result1.getId());
        record2.setId(result1.getId());

        var result2 = repository.save(record2);
        var findResult = repository.findById(record1.getId()).orElse(null);

        // Then
        assertThat(result1).isNotNull();
        assertThat(result2).isNotNull();
        assertThat(findResult).isNotNull();

        assertThat(result1.getId())
            .isEqualTo(result2.getId())
            .isEqualTo(findResult.getId());

        assertThat(result1).isEqualTo(record1);
        assertThat(result2).isEqualTo(record2);
        assertThat(findResult).isEqualTo(result2);
    }

    @Test
    public void testDeleteById() {
        // Given
        var record = repository.save(generator.generatePersisted());

        // When
        repository.deleteById(record.getId());
        var result = repository.findById(record.getId()).orElse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
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
}
