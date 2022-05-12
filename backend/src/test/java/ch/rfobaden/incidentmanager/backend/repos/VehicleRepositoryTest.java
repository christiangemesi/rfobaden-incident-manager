package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;

@DataJpaTest
public class VehicleRepositoryTest
    extends ModelRepositoryTest.Basic<Vehicle, VehicleRepository> {

    @Test
    void testFindAllVisible() {
        // Given
        var records = generator.generate(10);
        var visibleRecords = new ArrayList<Vehicle>();

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
        assertThat(result).isEqualTo(namedRecord);
    }
}
