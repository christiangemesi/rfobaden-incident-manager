package ch.rfobaden.incidentmanager.backend.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.WithMockAgent;
import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.services.DocumentService;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Optional;

@WebMvcTest(DocumentController.class)
class DocumentControllerTest extends AppControllerTest {
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
    private DocumentService documentService;

    protected ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();

    private static final String FILENAME = "filename.jpg";
    private final Document document;
    private final byte[] bytes;
    private final MockMultipartFile file;

    public DocumentControllerTest() {
        bytes = "some data".getBytes();
        file = new MockMultipartFile("file", FILENAME, "multipart/form-data", bytes);
        document = new Document(FILENAME);
        document.setId(1L);
    }

    @BeforeEach
    void setupMocks() {
        try {
            Mockito.when(documentService.detectMimeType(bytes))
                .thenReturn(MimeTypes.getDefaultMimeTypes().forName("application/pdf"));
        } catch (MimeTypeException e) {
            throw new IllegalStateException("failed to find pdf mime type", e);
        }
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToIncident() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes)))
            .thenReturn(document);
        Mockito.when(incidentService.find(document.getId()))
            .thenReturn(Optional.of(new Incident()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "incident")
                .param("modelId", document.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(content().json(mapper.writeValueAsString(document)));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToIncident_ownerNotFound() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);
        Mockito.when(incidentService.find(document.getId())).thenReturn(Optional.empty());

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "report")
                .param("modelId", document.getId().toString()))
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.message").value("owner not found: " + document.getId()));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToReport() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);
        Mockito.when(reportService.find(document.getId())).thenReturn(Optional.of(new Report()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "report")
                .param("modelId", document.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(content().json(mapper.writeValueAsString(document)));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToReport_ownerNotFound() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "report")
                .param("modelId", document.getId().toString()))
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.message").value("owner not found: " + document.getId()));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToTask() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);
        Mockito.when(taskService.find(document.getId())).thenReturn(Optional.of(new Task()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "task")
                .param("modelId", document.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(content().json(mapper.writeValueAsString(document)));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToTask_ownerNotFound() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "task")
                .param("modelId", document.getId().toString()))
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.message").value("owner not found: " + document.getId()));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToSubtask() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);
        Mockito.when(subtaskService.find(document.getId())).thenReturn(Optional.of(new Subtask()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "subtask")
                .param("modelId", document.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(content().json(mapper.writeValueAsString(document)));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentToSubtask_ownerNotFound() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "subtask")
                .param("modelId", document.getId().toString()))
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.message").value("owner not found: " + document.getId()));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentWithNoValidModelName() throws Exception {
        // When
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/documents")
                .file(file)
                .param("modelName", "not valid")
                .param("modelId", document.getId().toString()))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("unknown model: not valid"));
    }

    @Test
    @WithMockAgent
    void testUploadDocumentWithCustomFileName() throws Exception {
        // Given
        String name = "123abcABC#";
        Mockito.when(documentService.create(any(), eq(bytes))).thenReturn(document);
        Mockito.when(reportService.find(document.getId())).thenReturn(Optional.of(new Report()));

        // When
        var request = MockMvcRequestBuilders.multipart("/api/v1/documents")
            .file(file)
            .param("modelName", "report")
            .param("modelId", document.getId().toString())
            .param("name", name);

        // Then
        mockMvc.perform(request)
                .andExpect(status().is(200))
                .andExpect(content().json(mapper.writeValueAsString(document)));
    }

    @Test
    @WithMockAgent
    void testUploadDocument_failWhenReadingFile() throws Exception {
        // Given
        String errorMessage = "server error";
        MockMultipartFile file2 =
            new MockMultipartFile("file", FILENAME, "multipart/form-data", bytes) {
                @Override
                public byte[] getBytes() throws IOException {
                    throw new IOException(errorMessage);
                }
            };

        // When
        var request = MockMvcRequestBuilders.multipart("/api/v1/documents")
            .file(file2)
            .param("modelName", "subtask")
            .param("modelId", document.getId().toString());

        // Then
        mockMvc.perform(request)
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value(
                "failed to read uploaded file: " + errorMessage)
            );
    }

    @Test
    @WithMockAgent
    void testDownloadDocument() throws Exception {
        // Given
        Long id = 1L;

        FileSystemResource resource =
            new FileSystemResource(Paths.get("src/test/resources/files/blank.pdf"));
        Mockito.when(documentService.findDocument(id)).thenReturn(Optional.of(document));
        Mockito.when(documentService.loadFileByDocument(any())).thenReturn(Optional.of(resource));

        // When
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/documents/" + id)
            .accept(MediaType.APPLICATION_PDF);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().bytes(resource.getInputStream().readAllBytes()));
    }

}
