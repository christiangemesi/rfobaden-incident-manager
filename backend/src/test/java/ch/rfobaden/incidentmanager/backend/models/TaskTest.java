package ch.rfobaden.incidentmanager.backend.models;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.models.base.ModelTest;
import ch.rfobaden.incidentmanager.backend.test.generators.SubtaskGenerator;
import org.junit.jupiter.api.RepeatedTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.stream.Collectors;

class TaskTest extends ModelTest<Task> {
    @Autowired
    SubtaskGenerator subtaskGenerator;

    @RepeatedTest(5)
    void testGetSubtaskIds_notEmpty() {
        // Given
        var amount = (int) (Math.random() * 5);
        var value = generator.generate();
        value.getSubtasks().addAll(subtaskGenerator.generate(amount));
        var allReportIds = value.getSubtasks()
            .stream().map(Subtask::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getSubtaskIds().containsAll(allReportIds)
            && allReportIds.containsAll(value.getSubtaskIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    void testGetClosedSubtaskIds_allSubtasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5);
        var value = generator.generate();
        value.getSubtasks().addAll(subtaskGenerator.generate(amount));
        value.getSubtasks().forEach((subtask) -> subtask.setClosed(true));
        var allClosedReportIds = value.getSubtasks()
            .stream().filter(Subtask::isClosed)
            .map(Subtask::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getClosedSubtaskIds().containsAll(allClosedReportIds)
            && allClosedReportIds.containsAll(value.getClosedSubtaskIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    void testGetClosedSubtaskIds_someSubtasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getSubtasks().addAll(subtaskGenerator.generate(amount));
        value.getSubtasks().forEach((subtask) -> subtask.setClosed(Math.random() < 0.5));
        var allClosedReportIds = value.getSubtasks()
            .stream().filter(Subtask::isClosed)
            .map(Subtask::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getClosedSubtaskIds().containsAll(allClosedReportIds)
            && allClosedReportIds.containsAll(value.getClosedSubtaskIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    void testGetClosedSubtaskIds_noSubtasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5);
        var value = generator.generate();
        value.getSubtasks().addAll(subtaskGenerator.generate(amount));

        // Then
        assertThat(value.getClosedSubtaskIds()).isEmpty();
    }

    @RepeatedTest(5)
    void testIsClosed_unclosedSubtasks() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getSubtasks().addAll(subtaskGenerator.generate(amount));

        // Then
        assertThat(value.isClosed()).isFalse();
    }

    @RepeatedTest(5)
    void testIsClosed_mixedSubtasks() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getSubtasks().addAll(subtaskGenerator.generate(amount));
        value.getSubtasks().forEach((subtask) -> subtask.setClosed(Math.random() < 0.5));
        value.getSubtasks().add(subtaskGenerator.generate()); // ensure one not closed

        // Then
        assertThat(value.isClosed()).isFalse();
    }

    @RepeatedTest(5)
    void testIsDone_closedSubtasks() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getSubtasks().addAll(subtaskGenerator.generate(amount));
        value.getSubtasks().forEach((subtask) -> subtask.setClosed(true));

        // Then
        assertThat(value.isDone()).isTrue();
    }
}
