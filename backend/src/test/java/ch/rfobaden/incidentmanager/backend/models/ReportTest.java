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
    public void testGetTaskIds_notEmpty() {
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
    public void testGetClosedTaskIds_allTasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        value.getTasks().forEach((task) -> {
            task.getSubtasks().add(subtaskGenerator.generate());
            task.getSubtasks().get(0).setClosed(true);
        });
        var allClosedTaskIds = value.getTasks()
            .stream().filter(Task::isClosed)
            .map(Task::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getClosedTaskIds().containsAll(allClosedTaskIds)
            && allClosedTaskIds.containsAll(value.getClosedTaskIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    public void testGetClosedTaskIds_someTasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        value.getTasks().forEach((task) -> {
            task.getSubtasks().add(subtaskGenerator.generate());
            task.getSubtasks().get(0).setClosed(amount < 3);
        });
        var allClosedTaskIds = value.getTasks()
            .stream().filter(Task::isClosed)
            .map(Task::getId)
            .collect(Collectors.toList());

        // Then
        assertThat(value.getClosedTaskIds().containsAll(allClosedTaskIds)
            && allClosedTaskIds.containsAll(value.getClosedTaskIds())
        ).isTrue();
    }

    @RepeatedTest(5)
    public void testGetClosedTaskIds_noTasksClosed() {
        // Given
        var amount = (int) (Math.random() * 5) + 1;
        var value = generator.generate();
        value.getTasks().addAll(taskGenerator.generate(amount));
        value.getTasks().forEach(
            (task) -> task.getSubtasks().add(subtaskGenerator.generate())
        );

        // Then
        assertThat(value.getClosedTaskIds().isEmpty()).isTrue();
    }

    @RepeatedTest(5)
    public void testIsClosed_unclosedTasks() {
        // Given
        var value = generator.generate();
        value.getTasks().add(taskGenerator.generate());
        // This task is never closed, since it does not contain any subtasks by default.

        // Then
        assertThat(value.isClosed()).isFalse();
    }
}
