package ch.rfobaden.incidentmanager.backend.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.util.IncidentSerializerNoId;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@WebMvcTest(IncidentController.class)
class IncidentControllerTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper mapper;

    SimpleModule module = new SimpleModule();

    @MockBean
    IncidentService incidentService;

    private final Incident incidentUnused = new Incident(0, "incident1", 1,
            "This is an incident", LocalDate.now());
    private final Incident incident1 = new Incident(1, "incident1", 1,
            "This is an incident", LocalDate.now());
    private final Incident incident2 = new Incident(2, "incident2", 1,
            "This is an incident", LocalDate.now());
    private final Incident incident3 = new Incident(3, "incident3", 1,
            "This is an incident", LocalDate.now());

    @Test
    public void testGetAllIncidents() throws Exception {
        // Given
        List<Incident> incidentsList = new ArrayList<>(Arrays.asList(incident1,
                incident2, incident3));

        // When
        Mockito.when(incidentService.getIncidents()).thenReturn(incidentsList);
        MockHttpServletRequestBuilder mockRequest = MockMvcRequestBuilders.get("/api/v1/incidents");

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[2].title", is("incident3")));
        verify(incidentService, times(1)).getIncidents();
    }

    @Test
    public void testGetAllIncidentsEmpty() throws Exception {
        // Given
        List<Incident> incidents = new ArrayList<>();

        // When
        Mockito.when(incidentService.getIncidents()).thenReturn(incidents);
        MockHttpServletRequestBuilder mockRequest = MockMvcRequestBuilders.get("/api/v1/incidents");

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
        long incidentId = 2;

        // When
        Mockito.when(incidentService.getIncidentByID(incidentId))
                .thenReturn(Optional.of(incident2));
        MockHttpServletRequestBuilder mockRequest =
                MockMvcRequestBuilders.get("/api/v1/incidents/" + incidentId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.title", is("incident2")));
        verify(incidentService, times(1)).getIncidentByID(incidentId);
    }

    @Test
    public void testGetIncidentByIdNotFound() throws Exception {
        // Given
        long incidentId = 5;

        // When
        Mockito.when(incidentService.getIncidentByID(incidentId))
                .thenReturn(Optional.empty());
        MockHttpServletRequestBuilder mockRequest =
                MockMvcRequestBuilders.get("/api/v1/incidents/" + incidentId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.message", is("incident not found")));
        verify(incidentService, times(1)).getIncidentByID(incidentId);
    }


    @Test
    //doesnt work idk why 201 response instead of 200
    public void testAddNewIncident() throws Exception {
        // Given
        Incident newIncident = new Incident("incident4", 1, "This is an incident", LocalDate.now());
        Incident createdIncident = new Incident(4, "incident4", 1,
                "This is an incident", LocalDate.now());
        // Register custom mapper
        module.addSerializer(Incident.class, new IncidentSerializerNoId());
        mapper.registerModule(module);

        // When
        Mockito.when(incidentService.addNewIncident(newIncident)).thenReturn(createdIncident);
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/incidents/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(this.mapper.writeValueAsString(newIncident));

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.id", is(4)))
                .andExpect(jsonPath("$.title", is("incident4")));
        verify(incidentService, times(1)).addNewIncident(createdIncident);
    }

    @Test
    //todo 204 request
    public void testDeleteIncidentById() throws Exception {
        // Given
        long incidentId = 2;

        // When
        Mockito.when(incidentService.deleteIncidentByID(incidentId)).thenReturn(true);
        MockHttpServletRequestBuilder mockRequest =
                MockMvcRequestBuilders.delete("/api/v1/incidents/" + incidentId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").doesNotExist());
        verify(incidentService, times(1)).deleteIncidentByID(incidentId);
    }

    @Test
    public void testDeleteIncidentByIdNotFound() throws Exception {
        // Given
        long incidentId = 4;

        // When
        Mockito.when(incidentService.deleteIncidentByID(incidentId)).thenReturn(false);
        MockHttpServletRequestBuilder mockRequest =
                MockMvcRequestBuilders.delete("/api/v1/incidents/" + incidentId);

        // Then
        mockMvc.perform(mockRequest)
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.message", is("incident not found")));
        verify(incidentService, times(1)).deleteIncidentByID(incidentId);
    }



}