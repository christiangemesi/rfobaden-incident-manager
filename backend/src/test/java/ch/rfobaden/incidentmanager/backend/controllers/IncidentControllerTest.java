package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelControllerTest;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.test.generators.CloseReasonGenerator;
import org.junit.jupiter.api.RepeatedTest;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.Optional;


@WebMvcTest(IncidentController.class)
class IncidentControllerTest extends ModelControllerTest.Basic<Incident, IncidentService> {
    @Autowired
    CloseReasonGenerator closeReasonGenerator;

    @Override
    protected String getEndpointFor(EmptyPath path) {
        return "/api/v1/incidents/";
    }

    @RepeatedTest(5)
    void testClose() throws Exception {
        // Given
        var record = generator.generate();
        var closeReason = closeReasonGenerator.generate();

        var closeData = new IncidentController.CloseMessageData();
        closeData.setMessage(closeReason.getMessage());

        var updatedRecord = generator.copy(record);
        updatedRecord.setClosed(true);
        updatedRecord.setCloseReason(closeReason);
        updatedRecord.setUpdatedAt(LocalDateTime.now());

        var path = record.toPath();
        mockRelations(path, record);
        Mockito.when(service.closeIncident(record.getId(), closeData.getMessage()))
            .thenReturn(Optional.of(updatedRecord));

        // When
        var mockRequest = MockMvcRequestBuilders
            .put(getEndpointFor(path, record.getId()) + "/close")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(closeData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(updatedRecord)));
        verify(service, times(1)).closeIncident(record.getId(), closeData.getMessage());
    }

    @RepeatedTest(5)
    void testReopen() throws Exception {
        // Given
        var record = generator.generate();
        var closeReason = closeReasonGenerator.generate();

        var closeData = new IncidentController.CloseMessageData();
        closeData.setMessage(closeReason.getMessage());
        record.setCloseReason(closeReason);
        record.setClosed(true);

        var updatedRecord = generator.copy(record);
        updatedRecord.setClosed(false);
        updatedRecord.setUpdatedAt(LocalDateTime.now());

        var path = record.toPath();
        mockRelations(path, record);
        Mockito.when(service.reopenIncident(record.getId()))
            .thenReturn(Optional.of(updatedRecord));

        // When
        var mockRequest = MockMvcRequestBuilders
            .put(getEndpointFor(path, record.getId()) + "/reopen")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(closeData));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(updatedRecord)));
        verify(service, times(1)).reopenIncident(record.getId());
    }
}