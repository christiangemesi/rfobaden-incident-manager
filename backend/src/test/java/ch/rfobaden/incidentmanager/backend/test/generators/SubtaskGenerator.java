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

//    @Autowired
//    TaskGenerator taskGenerator;

    @Autowired
    UserGenerator userGenerator;

    @Override
    public Subtask generateNew() {
        Subtask subtask = new Subtask();
        subtask.setTitle(faker.funnyName().name());
        subtask.setDescription(faker.lorem().sentence(10));
        subtask.setAssignee(userGenerator.generate());
        subtask.setClosed(faker.bool().bool());
        subtask.setPriority(faker.options().option(Priority.class));
        // subtask.setTask(taskGenerator.generate());

        subtask.setCreatedAt(LocalDateTime.now().minusDays(faker.random()
            .nextInt(0, 365 * 1000)));

        subtask.setStartsAt(LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));

        if (faker.bool().bool()) {
            subtask.setEndsAt(
                LocalDateTime.now().minusDays(faker.random().nextInt(0, 365 * 1000)));
        }

        if (faker.bool().bool()) {
            subtask.setUpdatedAt(
                LocalDateTime.now().plusDays(faker.random().nextInt(0, 365 * 1000)));
        }
        return subtask;
    }
}
