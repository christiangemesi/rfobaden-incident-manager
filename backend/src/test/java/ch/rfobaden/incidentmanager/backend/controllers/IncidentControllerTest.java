package ch.rfobaden.incidentmanager.backend.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;
import java.util.Optional;


@WebMvcTest(IncidentController.class)
class IncidentControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    IncidentService incidentService;

    ObjectMapper requestMapper = Jackson2ObjectMapperBuilder.json().build();

    private final Incident incident1 = new Incident(
        1L, "Incident Title 1", 11L
    );
    private final Incident incident2 = new Incident(
        2L, "Incident Title 2", 22L
    );
    private final Incident incident3 = new Incident(
        3L, "Incident Title 3", 33L
    );

    @Test
    public void testGetAllIncidents() throws Exception {
        // Given
        var incidents = List.of(incident1, incident2, incident3);
        Mockito.when(incidentService.getIncidents())
            .thenReturn(incidents);

        // When
        var request = MockMvcRequestBuilders.get("/api/v1/incidents");

        // Then
        mockMvc.perform(request)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$", hasSize(incidents.size())))
            .andExpect(jsonPath("$[0].id", is(incidents.get(0).getId()), Long.class))
            .andExpect(jsonPath("$[1].id", is(incidents.get(1).getId()), Long.class))
            .andExpect(jsonPath("$[2].id", is(incidents.get(2).getId()), Long.class));
        verify(incidentService, times(1)).getIncidents();
    }

    @Test
    public void testGetAllIncidentsEmpty() throws Exception {
        // Given
        Mockito.when(incidentService.getIncidents())
            .thenReturn(List.of());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/incidents");

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
        verify(incidentService, times(1)).getIncidents();
    }

    @Test
    public void testGetIncidentById() throws Exception {
        // Given
        var incident = incident2;
        Mockito.when(incidentService.getIncidentById(incident.getId()))
            .thenReturn(Optional.of(incident));

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/incidents/" + incident.getId());

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.id").value(incident.getId()));
        verify(incidentService, times(1)).getIncidentById(incident.getId());
    }

    @Test
    public void testGetIncidentByIdNotFound() throws Exception {
        // Given
        long incidentId = 4;
        Mockito.when(incidentService.getIncidentById(incidentId))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/incidents/" + incidentId);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("incident not found")));
        verify(incidentService, times(1)).getIncidentById(incidentId);
    }

    @Test
    public void testAddNewIncident() throws Exception {
        // Given
        var newIncident = new Incident("Incident Title 1", 11L);
        var createdIncident = new Incident(4L, newIncident.getTitle(), newIncident.getAuthorId());
        Mockito.when(incidentService.addNewIncident(newIncident))
            .thenReturn(createdIncident);

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/incidents/")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(requestMapper.writeValueAsString(newIncident));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.id", Long.class).value(createdIncident.getId()));
        verify(incidentService, times(1)).addNewIncident(newIncident);
    }

    @Test
    public void testCloseIncident() throws Exception {
        // Given
        var currentIncident = incident1;
        var currentIncidentId = currentIncident.getId();
        var closeDate = new IncidentController.CloseIncidentData();
        closeDate.setCloseReason("Finish");
        var closedIncident = new Incident(
            currentIncidentId,
            currentIncident.getTitle(),
            currentIncident.getAuthorId()
        );
        closedIncident.setClosed(true);
        closedIncident.setCloseReason(closeDate.getCloseReason());
        Mockito.when(incidentService.closeIncident(currentIncidentId, closeDate.getCloseReason()))
            .thenCallRealMethod();
        Mockito.when(incidentService.getIncidentById(currentIncidentId))
            .thenReturn(Optional.of(currentIncident));
        Mockito.when(incidentService.updateIncident(currentIncidentId, currentIncident))
            .thenReturn(closedIncident);

        // When
        var mockRequest =
            MockMvcRequestBuilders.put("/api/v1/incidents/" + currentIncidentId + "/close")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(requestMapper.writeValueAsString(closeDate));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.isClosed").value(closedIncident.isClosed()))
            .andExpect(jsonPath("$.closeReason").value(closedIncident.getCloseReason()));
        verify(incidentService, times(1))
            .closeIncident(currentIncidentId, closeDate.getCloseReason());
    }

    @Test
    public void testCloseIncidentByIdNotFound() throws Exception {
        // Given
        Long incidentId = 4L;
        Mockito.when(incidentService.getIncidentById(incidentId))
            .thenCallRealMethod();
        var closeDate = new IncidentController.CloseIncidentData();

        // When
        var mockRequest =
            MockMvcRequestBuilders.put("/api/v1/incidents/" + incidentId + "/close")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(requestMapper.writeValueAsString(closeDate));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("incident not found")));
        verify(incidentService, times(1)).closeIncident(incidentId, closeDate.getCloseReason());
    }

    @Test
    public void testDeleteIncidentById() throws Exception {
        // Given
        long incidentId = 2;
        Mockito.when(incidentService.deleteIncidentById(incidentId))
            .thenReturn(true);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/incidents/" + incidentId);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNoContent())
            .andExpect(jsonPath("$").doesNotExist());
        verify(incidentService, times(1)).deleteIncidentById(incidentId);
    }

    @Test
    public void testDeleteIncidentByIdNotFound() throws Exception {
        // Given
        long incidentId = 4;
        Mockito.when(incidentService.deleteIncidentById(incidentId))
            .thenReturn(false);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/incidents/" + incidentId);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("incident not found")));
        verify(incidentService, times(1)).deleteIncidentById(incidentId);
    }
}