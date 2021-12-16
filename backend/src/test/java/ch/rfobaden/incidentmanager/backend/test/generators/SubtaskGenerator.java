package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Priority;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

import java.time.LocalDateTime;

@TestComponent
public class SubtaskGenerator extends ModelGenerator<Subtask> {
    @Autowired
    TaskGenerator taskGenerator;

    @Autowired
    UserGenerator userGenerator;

    @Override
    public Subtask generateNew() {
        Subtask subtask = new Subtask();

        subtask.setTitle(faker.funnyName().name());
        subtask.setDescription(doMaybe(() -> faker.lorem().sentence(10)));
        subtask.setClosed(faker.bool().bool());
        subtask.setPriority(faker.options().option(Priority.class));

        subtask.setStartsAt(doMaybe(this::randomDateTime));
        subtask.setEndsAt(doMaybe(this::randomDateTime));

        subtask.setTask(taskGenerator.generate());
        subtask.setAssignee(doMaybe(userGenerator::generate));

        return subtask;
    }
}
