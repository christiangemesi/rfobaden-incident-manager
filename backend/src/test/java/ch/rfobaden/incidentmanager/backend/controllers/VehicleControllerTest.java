package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.WithMockAgent;
import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.stream.Collectors;

@WebMvcTest(VehicleController.class)
class VehicleControllerTest
    extends ModelControllerTest.Basic<Vehicle, VehicleService> {

    @Autowired
    MockMvc mockMvc;

    ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();

    @Test
    @WithMockAgent
    void testListVisible() throws Exception {
        // Given
        var amount = 10;
        var vehicles = generator.generate(amount);
        for (int i = 0; i < Math.random() * (amount - 1) + 1; i++) {
            vehicles.get(i).setVisible(true);
        }

        var visibleVehicles = vehicles.stream()
            .filter(Vehicle::isVisible)
            .collect(Collectors.toList());

        Mockito.when(service.listVisible())
            .thenReturn(visibleVehicles);

        // When
        var mockRequest = MockMvcRequestBuilders
            .get("/api/v1/vehicles/visible")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(visibleVehicles));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists());
        verify(service, times(1)).listVisible();
    }

    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/vehicles/";
    }
}
