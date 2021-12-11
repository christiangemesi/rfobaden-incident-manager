package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.paths.ReportPath;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.repos.ReportRepository;
import ch.rfobaden.incidentmanager.backend.repos.SubtaskRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryServiceTest;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

@SpringBootTest
public class SubtaskServiceTest extends
    ModelRepositoryServiceTest<Subtask, SubtaskPath, SubtaskService, SubtaskRepository> {

    @MockBean
    UserService userService;

    @MockBean
    TaskService taskService;

    @Override
    protected void mockLoadRelations(Subtask subtask) {
        var assignee = subtask.getAssignee();
        if (assignee != null) {
            Mockito.when(userService.find(assignee.getId()))
                .thenReturn(Optional.of(assignee));
        }

        var task = subtask.getTask();
        if (task != null) {
            Mockito.when(taskService.find(task.getId()))
                .thenReturn(Optional.of(task));
        }
    }
}
