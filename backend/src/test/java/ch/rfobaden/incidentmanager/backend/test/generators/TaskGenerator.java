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
        task.setDescription(doMaybe(() -> faker.lorem().sentence(10)));
        task.setPriority(faker.options().option(Priority.class));
        task.setLocation(doMaybe(() -> faker.country().capital()));

        task.setStartsAt(doMaybe(this::randomDateTime));
        task.setEndsAt(doMaybe(this::randomDateTime));

        task.setReport(reportGenerator.generate());
        task.setAssignee(doMaybe(userGenerator::generate));

        return task;
    }
}
