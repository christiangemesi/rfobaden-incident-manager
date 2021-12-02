package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


@WebMvcTest(IncidentController.class)
class IncidentControllerTest extends ModelControllerTest.Basic<Incident, IncidentService> {
    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/incidents/";
    }

    @Test
    public void testCloseIncident() throws Exception {
        // Given
        List<Incident> incidents =
            generator.generateNew(100);
        // Get open incident
        Incident openIncident =
            incidents.stream().filter(inc -> !inc.isClosed()).findAny()
                .orElseThrow(() -> new Exception(
                    "Congratulations you beat the odds of 1/2^100 and didn't get a single incident that is not closed"));
        long openIncidentId = openIncident.getId();

        // Get closed incident
        var closeData = new IncidentController.CloseIncidentData();
        closeData.setCloseReason("Finish");
        Incident closedIncident = new Incident();
        closedIncident.setId(openIncidentId);
        closedIncident.setTitle(openIncident.getTitle());
        closedIncident.setClosed(true);
        closedIncident.setCloseReason(closeData.getCloseReason());

        Mockito.when(service.closeIncident(openIncidentId, closeData.getCloseReason()))
            .thenCallRealMethod();
        Mockito.when(service.find(openIncidentId))
            .thenReturn(Optional.of(openIncident));
        Mockito.when(service.update(EmptyPath.getInstance(), openIncident))
            .thenReturn(Optional.of(closedIncident));

        // When
        var mockRequest =
            MockMvcRequestBuilders.put("/api/v1/incidents/" + openIncidentId + "/close")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(closeData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.isClosed").value(closedIncident.isClosed()))
            .andExpect(jsonPath("$.closeReason").value(closedIncident.getCloseReason()));
        verify(service, times(1))
            .closeIncident(openIncidentId, closeData.getCloseReason());
    }

    @Test
    public void testReopenIncident() throws Exception {
        // Given
        List<Incident> incidents =
            generator.generateNew(100);
        // Get closed incident
        Incident closedIncident =
            incidents.stream().filter(Incident::isClosed).findAny()
                .orElseThrow(() -> new Exception(
                    "Congratulations you beat the odds of 1/2^100 and didn't get a single incident that is open"));

        // Get reopened incident
        Incident reopenedIncident = new Incident();
        reopenedIncident.setId(closedIncident.getId());
        reopenedIncident.setTitle(closedIncident.getTitle());
        reopenedIncident.setCloseReason(null);
        reopenedIncident.setClosed(false);

        Mockito.when(service.reopenIncident(closedIncident.getId()))
            .thenCallRealMethod();
        Mockito.when(service.find(closedIncident.getId()))
            .thenReturn(Optional.of(closedIncident));
        Mockito.when(service.update(EmptyPath.getInstance(), closedIncident))
            .thenReturn(Optional.of(reopenedIncident));

        // When
        var mockRequest =
            MockMvcRequestBuilders.put("/api/v1/incidents/" + closedIncident.getId() + "/reopen")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.isClosed").value(reopenedIncident.isClosed()))
            .andExpect(jsonPath("$.closeReason").isEmpty());
        verify(service, times(1))
            .reopenIncident(closedIncident.getId());
    }
}