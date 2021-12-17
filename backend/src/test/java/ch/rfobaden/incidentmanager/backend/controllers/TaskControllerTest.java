package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.util.Optional;

@WebMvcTest(TaskController.class)
@Import(AppControllerTest.SecurityContextMock.class)
public class TaskControllerTest
    extends ModelControllerTest<Task, TaskPath, TaskService> {

    @MockBean
    ReportService reportService;

    @Autowired
    protected UserService userService;

    @Override
    protected String getEndpointFor(TaskPath path) {
        return "/api/v1/incidents/"
            + path.getIncidentId()
            + "/reports/"
            + path.getReportId()
            + "/tasks/";
    }

    @Override
    protected void mockRelations(TaskPath taskPath, Task task) {
        Mockito.when(reportService.find(taskPath, taskPath.getReportId()))
            .thenReturn(Optional.of(task.getReport()));

        var assignee = task.getAssignee();
        if (assignee != null) {
            Mockito.when(userService.find(assignee.getId()))
                .thenReturn(Optional.of(assignee));
        }
    }
}








