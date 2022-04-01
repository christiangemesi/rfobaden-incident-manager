package ch.rfobaden.incidentmanager.backend.services.base;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.RepeatedTest;
import org.mockito.Answers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import java.util.Optional;

@SpringBootTest
@Import(TestConfig.class)
public class ModelServiceTest {
    @Mock(answer = Answers.CALLS_REAL_METHODS)
    ModelService<Model.Basic, EmptyPath> service;

    @RepeatedTest(5)
    public void testCreate() {
        // Given
        var input = new TestModel();
        var output = new TestModel();

        Mockito.when(service.create(input.toPath(), input))
            .thenReturn(output);

        // When
        var result = service.create(input);

        // Then
        assertThat(result).isEqualTo(output);
        verify(service, times(1)).create(input.toPath(), input);
    }

    @RepeatedTest(5)
    public void testUpdate() {
        // Given
        var input = new TestModel();
        var output = new TestModel();

        Mockito.when(service.update(input.toPath(), input))
            .thenReturn(Optional.of(output));

        // When
        var result = service.update(input);

        // Then
        assertThat(result).isEqualTo(Optional.of(output));
        verify(service, times(1)).update(input.toPath(), input);
    }

    @RepeatedTest(5)
    public void testDelete() {
        // Given
        var input = new TestModel();

        Mockito.when(service.delete(input.toPath(), input.getId()))
            .thenReturn(true);

        // When
        var result = service.delete(input);

        // Then
        assertThat(result).isTrue();
        verify(service, times(1)).delete(input.toPath(), input.getId());
    }

    private static final class TestModel extends Model.Basic {
        private static Long NEXT_ID = 0L;

        public TestModel() {
            this.setId(NEXT_ID++);
        }

        @Override
        public boolean equals(Object other) {
            return this == other;
        }

        @Override
        public int hashCode() {
            return this.getId().hashCode();
        }
    }
}
