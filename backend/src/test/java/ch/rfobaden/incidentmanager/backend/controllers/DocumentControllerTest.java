package ch.rfobaden.incidentmanager.backend.controllers;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.WithMockAgent;
import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.services.DocumentFileService;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Optional;

@WebMvcTest(DocumentControllerTest.class)
public class DocumentControllerTest extends AppControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IncidentService incidentService;

    @MockBean
    private ReportService reportService;

    @MockBean
    private TaskService taskService;

    @MockBean
    private SubtaskService subtaskService;

    @MockBean
    private DocumentFileService documentFileService;

    private static final String FILENAME = "filename.pdf";
    private final Document document;
    private final byte[] bytes;
    private final MockMultipartFile file;


    public DocumentControllerTest() {
        bytes = "some data".getBytes();
        file = new MockMultipartFile("file", FILENAME, "multipart/form-data", bytes);
        document = new Document(FILENAME);
        document.setId(1L);
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToIncident() throws Exception {
        // When
        Mockito.when(documentFileService.save(bytes, FILENAME)).thenReturn(document);
        Mockito.when(incidentService.find(document.getId())).thenReturn(Optional.of(new Incident()));
          // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "incident")
                .param("id", document.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(MockMvcResultMatchers.content().string(document.getId().toString()));
    }

}
