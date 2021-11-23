package ch.rfobaden.incidentmanager.backend.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelper;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;
import java.util.Optional;

@WebMvcTest(ReportController.class)
@Import(AppControllerTest.SecurityContextMock.class)
public class ReportControllerTest extends AppControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    ReportService reportService;

    @MockBean
    IncidentService incidentService;

    ObjectMapper requestMapper = Jackson2ObjectMapperBuilder.json().build();

    @Autowired
    SecurityContextMock securityContextMock;

    UserGenerator userGenerator;

    private final Incident incident;

    private final Report report1;
    private final Report report2;
    private final Report report3;

    private final User author;

    @Autowired
    ReportControllerTest(UserGenerator userGenerator) {
        this.userGenerator = userGenerator;
        author = userGenerator.generate();
        incident = new Incident(1L, "Title", author.getId());
        report1 = new Report(1L, "Report Title 1", userGenerator.generate(), incident);
        report2 = new Report(2L, "Report Title 2", userGenerator.generate(), incident);
        report3 = new Report(3L, "Report Title 3", userGenerator.generate(), incident);
    }

    @BeforeEach
    public void setupIncidentService() {
        Mockito.when(incidentService.getIncidentById(incident.getId()))
            .thenReturn(Optional.of(incident));
    }

    @BeforeEach
    public void setupAuth() {
        securityContextMock.mockAuth(author);
    }

    @Test
    public void testGetAllReports() throws Exception {
        // Given
        var reports = List.of(report1, report2, report3);
        Mockito.when(reportService.getReportsOfIncident(incident.getId()))
            .thenReturn(reports);

        // When
        var request = MockMvcRequestBuilders.get("/api/v1/incidents/1/reports/");

        // Then
        mockMvc.perform(request)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$", hasSize(reports.size())))
            .andExpect(jsonPath("$[0].id", is(reports.get(0).getId()), Long.class))
            .andExpect(jsonPath("$[1].id", is(reports.get(1).getId()), Long.class))
            .andExpect(jsonPath("$[2].id", is(reports.get(2).getId()), Long.class));
        verify(reportService, times(1)).getReportsOfIncident(incident.getId());
    }

    @Test
    public void testGetAllReportsEmpty() throws Exception {
        // Given
        Mockito.when(reportService.getReportsOfIncident(incident.getId()))
            .thenReturn(List.of());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/incidents/1/reports/");

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
        verify(reportService, times(1)).getReportsOfIncident(incident.getId());
    }

    @Test
    public void testGetReportById() throws Exception {
        // Given
        var report = report2;
        Mockito.when(reportService.getReportOfIncidentById(incident.getId(), report.getId()))
            .thenReturn(Optional.of(report));

        // When
        var mockRequest = MockMvcRequestBuilders.get(
            "/api/v1/incidents/1/reports/" + report.getId()
        );

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.id").value(report.getId()));
        verify(reportService, times(1)).getReportOfIncidentById(incident.getId(), report.getId());
    }

    @Test
    public void testGetReportNotFound() throws Exception {
        // Given
        long reportId = 1;
        Mockito.when(reportService.getReportOfIncidentById(incident.getId(), reportId))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/incidents/1/reports/" + reportId);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("report not found")));
        verify(reportService, times(1)).getReportOfIncidentById(incident.getId(), reportId);
    }

    @Test
    public void testAddNewReport() throws Exception {
        // Given
        var author = userGenerator.generate();

        var newReport = new Report(1L, "Report Title 1", author, incident);
        var createdReport = new Report(2L, "Report Title 1", author, incident);
        createdReport.setCreatedAt(newReport.getCreatedAt());
        createdReport.setUpdatedAt(newReport.getUpdatedAt());
        Mockito.when(reportService.addNewReport(any()))
            .thenReturn(createdReport);

        // When
        var mockRequest = MockMvcRequestBuilders.post("/api/v1/incidents/1/reports/")
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
        Mockito.when(reportService.getReportOfIncidentById(incident.getId(), report1.getId()))
            .thenReturn(Optional.of(report1));
        Mockito.when(reportService.deleteReportById(report1.getId()))
            .thenReturn(true);

        // When
        var mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/incidents/1/reports/" + report1.getId());

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNoContent())
            .andExpect(jsonPath("$").doesNotExist());
        verify(reportService, times(1)).deleteReportById(report1.getId());
    }

    @Test
    public void testDeleteReportByIdNotFound() throws Exception {
        // Given
        Mockito.when(reportService.getReportOfIncidentById(incident.getId(), report1.getId()))
            .thenReturn(Optional.of(report1));
        Mockito.when(reportService.deleteReportById(report1.getId()))
            .thenReturn(false);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete("/api/v1/incidents/1/reports/" + report1.getId());

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("report not found")));
        verify(reportService, times(1)).deleteReportById(report1.getId());
    }
}








