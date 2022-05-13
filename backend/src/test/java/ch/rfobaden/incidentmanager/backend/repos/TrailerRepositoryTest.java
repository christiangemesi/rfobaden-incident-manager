package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.Optional;

@DataJpaTest
public class TrailerRepositoryTest
    extends ModelRepositoryTest.Basic<Trailer, TrailerRepository> {

    @Test
    void testFindAllVisible() {
        // Given
        var records = generator.generate(10);
        var visibleRecords = new ArrayList<Trailer>();

        for (var record : records) {
            record.setVisible(generator.randomBoolean());
            record = repository.save(record);
            if (record.isVisible()) {
                visibleRecords.add(record);
            }
        }

        // When
        var result = repository.findAllVisible();

        // Then
        assertThat(result.size()).isEqualTo(visibleRecords.size());
        assertThat(result).asList().containsExactlyInAnyOrderElementsOf(visibleRecords);
    }

    @Test
    void testFindByName() {
        // Given
        var amount = 10;
        var records = generator.generate(amount);
        records = repository.saveAll(records);

        var namedRecord = records.get((int) (Math.random() * amount));
        var name = namedRecord.getName();

        // When
        var result = repository.findByName(name);

        // Then
        assertThat(result).isEqualTo(Optional.of(namedRecord));
    }
}
