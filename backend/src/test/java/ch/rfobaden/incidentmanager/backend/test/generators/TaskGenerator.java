package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Priority;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

import java.time.LocalDateTime;

@TestComponent
public class TaskGenerator extends ModelGenerator<Task> {

    @Autowired
    UserGenerator userGenerator;

    @Autowired
    ReportGenerator reportGenerator;

    @Override
    public Task generateNew() {
        Task task = new Task();
        task.setTitle(faker.funnyName().name());
        task.setDescription(faker.lorem().sentence(10));
        task.setAssignee(userGenerator.generate());
        task.setPriority(faker.options().option(Priority.class));
        task.setReport(reportGenerator.generate());
        task.setLocation(faker.country().capital());

        task.setCreatedAt(LocalDateTime.now().minusDays(faker.random()
            .nextInt(0, 365 * 1000)));

        task.setStartsAt(LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));

        if (faker.bool().bool()) {
            task.setEndsAt(
                LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));
        }

        if (faker.bool().bool()) {
            task.setUpdatedAt(
                LocalDateTime.now().plusDays(faker.random().nextInt(0, 365 * 1000)));
        }
        return task;
    }
}
