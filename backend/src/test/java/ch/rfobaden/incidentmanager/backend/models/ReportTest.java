package ch.rfobaden.incidentmanager.backend.models;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.models.base.ModelTest;
import ch.rfobaden.incidentmanager.backend.test.generators.SubtaskGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.TaskGenerator;
import org.junit.jupiter.api.RepeatedTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.stream.Collectors;

class ReportTest extends ModelTest<Report> {
    @Autowired
    TaskGenerator taskGenerator;

    @Autowired
    SubtaskGenerator subtaskGenerator;

    @RepeatedTest(5)
    void testGetTaskIds_notEmpty() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        var allReportIds = value.getTasks()
            .stream().map(Task::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getTaskIds().containsAll(allReportIds)
            && allReportIds.containsAll(value.getTaskIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    void testGetClosedTaskIds_allTasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        value.getTasks().forEach((task) -> {
            task.getSubtasks().add(subtaskGenerator.generate());
            task.getSubtasks().get(0).setClosed(true);
        });
        var allClosedTaskIds = value.getTasks()
            .stream().filter(t -> t.isClosed() || t.isDone())
            .map(Task::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getClosedTaskIds().containsAll(allClosedTaskIds)
            && allClosedTaskIds.containsAll(value.getClosedTaskIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    void testGetClosedTaskIds_someTasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        value.getTasks().forEach((task) -> {
            task.getSubtasks().add(subtaskGenerator.generate());
            task.getSubtasks().get(0).setClosed(Math.random() < 0.5);
        });
        var allClosedTaskIds = value.getTasks()
            .stream().filter(t -> t.isClosed() || t.isDone())
            .map(Task::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getClosedTaskIds().containsAll(allClosedTaskIds)
            && allClosedTaskIds.containsAll(value.getClosedTaskIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    void testGetClosedTaskIds_noTasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        value.getTasks().forEach(
            (task) -> task.getSubtasks().add(subtaskGenerator.generate())
        );

        // Then
        assertThat(value.getClosedTaskIds()).isEmpty();
    }

    @RepeatedTest(5)
    void testIsClosed_unclosedTasks() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));

        // Then
        assertThat(value.isClosed()).isFalse();
    }

    @RepeatedTest(5)
    void testIsClosed_mixedTasks() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        value.getTasks().forEach((task) -> {
            task.getSubtasks().add(subtaskGenerator.generate());
            task.getSubtasks().get(0).setClosed(Math.random() < 0.5);
        });
        value.getTasks().add(taskGenerator.generate()); // ensure one not closed

        // Then
        assertThat(value.isClosed()).isFalse();
    }

    @RepeatedTest(5)
    void testIsDone_closedTasks() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        value.getTasks().forEach((task) -> {
            task.getSubtasks().add(subtaskGenerator.generate());
            task.getSubtasks().get(0).setClosed(true);
        });

        // Then
        assertThat(value.isDone()).isTrue();
    }
}
