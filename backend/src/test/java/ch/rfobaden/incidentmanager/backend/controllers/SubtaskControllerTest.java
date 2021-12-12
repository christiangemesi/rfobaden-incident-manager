package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import java.util.Optional;

@WebMvcTest(SubtaskController.class)
@Import(AppControllerTest.SecurityContextMock.class)
public class SubtaskControllerTest
    extends ModelControllerTest<Subtask, SubtaskPath, SubtaskService> {

    @MockBean
    TaskService taskService;

    @Override
    protected String getEndpointFor(SubtaskPath path) {
        return "/api/v1/incidents/"
            + path.getIncidentId()
            + "/reports/"
            + path.getReportId()
            + "/tasks/"
            + path.getTaskId()
            + "/subtasks/";
    }

    @Override
    protected void mockRelations(SubtaskPath path, Subtask subtask) {
        Mockito.when(taskService.find(path, path.getTaskId()))
            .thenReturn(Optional.of(subtask.getTask()));
    }
}








