package ch.rfobaden.incidentmanager.backend.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
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

@WebMvcTest(ReportController.class)
public class ReportControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    ReportService reportService;

    ObjectMapper requestMapper = Jackson2ObjectMapperBuilder.json().build();

    private final Report report1 = new Report(1L, "Report Title 1", 11L);
    private final Report report2 = new Report(2L, "Report Title 2", 22L);
    private final Report report3 = new Report(3L, "Report Title 3", 33L);

    @Test
    public void testGetAllReports() throws Exception {
        // Given
        var reports = List.of(report1, report2, report3);
        Mockito.when(reportService.getReports())
            .thenReturn(reports);

        // When
        var request = MockMvcRequestBuilders.get("/api/v1/reports");

        // Then
        mockMvc.perform(request)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$", hasSize(reports.size())))
            .andExpect(jsonPath("$[0].id", is(reports.get(0).getId()), Long.class))
            .andExpect(jsonPath("$[1].id", is(reports.get(1).getId()), Long.class))
            .andExpect(jsonPath("$[2].id", is(reports.get(2).getId()), Long.class));
        verify(reportService, times(1)).getReports();
    }

    @Test
    public void testGetAllReportsEmpty() throws Exception {
        // Given
        Mockito.when(reportService.getReports())
            .thenReturn(List.of());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/reports");

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
        verify(reportService, times(1)).getReports();
    }

    @Test
    public void testGetReportById() throws Exception {
        // Given
        var report = report2; // TODO: ask why
        Mockito.when(reportService.getReportById(report.getId()))
            .thenReturn(Optional.of(report));

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/reports");

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.id").value(report.getId()));
        verify(reportService, times(1)).getReportById(report.getId());
    }

    @Test
    public void testGetReportNotFound() throws Exception {
        // Given
        long reportId = 4; // TODO: ask is that not to near by other id's
        Mockito.when(reportService.getReportById(reportId))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/reports");

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("report not found")));
        verify(reportService, times(1)).getReportById(reportId);
    }

    @Test
    public void testAddNewReport() throws Exception {
        // Given
        var newReport = new Report("Report Title 1", 11L);
        var createdReport = new Report(4L, newReport.getTitle(), newReport.getAuthorId());
        createdReport.setCreatedAt(newReport.getCreatedAt());
        createdReport.setUpdatedAt(newReport.getUpdatedAt());
        Mockito.when(reportService.addNewReport(any()))
            .thenReturn(createdReport);

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/vi/reports")
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(requestMapper.writeValueAsString(newReport));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.id", Long.class).value(createdReport.getId()));
        verify(reportService, times(1)).addNewReport(any());
    }

    @Test
    public void testDeleteReportById() throws Exception {
        // Given
        long reportId = 2;
        Mockito.when(reportService.deleteReportById(reportId))
            .thenReturn(true);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/reports/" + reportId);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNoContent())
            .andExpect(jsonPath("$").doesNotExist()); // TODO: why? there is one with that id
        verify(reportService, times(1)).deleteReportById(reportId);
    }

    @Test
    public void testDeleteReportByIdNotFound() throws Exception {
        // Given
        long reportId = 4;
        Mockito.when(reportService.deleteReportById(reportId))
            .thenReturn(false);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/reports/" + reportId);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("report not found")));
        verify(reportService, times(1)).deleteReportById(reportId);
    }
}








