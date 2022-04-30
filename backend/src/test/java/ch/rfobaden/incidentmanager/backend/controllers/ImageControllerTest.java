package ch.rfobaden.incidentmanager.backend.controllers;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppControllerTest;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.WithMockAgent;
import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.services.ImageFileService;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Optional;

@WebMvcTest(ImageController.class)
class ImageControllerTest extends AppControllerTest {
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
    private ImageFileService imageFileService;

    private static final String FILENAME = "filename.jpg";
    private final Image image;
    private final byte[] bytes;
    private final MockMultipartFile file;

    public ImageControllerTest() {
        bytes = "some data".getBytes();
        file = new MockMultipartFile("file", FILENAME, "multipart/form-data", bytes);
        image = new Image(FILENAME);
        image.setId(1L);
    }

    @Test
    @WithMockAgent
    void testUploadImageToIncident() throws Exception {
        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);
        Mockito.when(incidentService.find(image.getId())).thenReturn(Optional.of(new Incident()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "incident")
                .param("id", image.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(content().string(image.getId().toString()));
    }

    @Test
    @WithMockAgent
    void testUploadImageToIncident_ownerNotFound() throws Exception {
        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);
        Mockito.when(incidentService.find(image.getId())).thenReturn(Optional.empty());

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "report")
                .param("id", image.getId().toString()))
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.message").value("owner not found: " + image.getId()));
    }

    @Test
    @WithMockAgent
    void testUploadImageToReport() throws Exception {
        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);
        Mockito.when(reportService.find(image.getId())).thenReturn(Optional.of(new Report()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "report")
                .param("id", image.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(content().string(image.getId().toString()));
    }

    @Test
    @WithMockAgent
    void testUploadImageToReport_ownerNotFound() throws Exception {
        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "report")
                .param("id", image.getId().toString()))
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.message").value("owner not found: " + image.getId()));
    }

    @Test
    @WithMockAgent
    void testUploadImageToTask() throws Exception {

        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);
        Mockito.when(taskService.find(image.getId())).thenReturn(Optional.of(new Task()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "task")
                .param("id", image.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(content().string(image.getId().toString()));
    }

    @Test
    @WithMockAgent
    void testUploadImageToTask_ownerNotFound() throws Exception {
        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "task")
                .param("id", image.getId().toString()))
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.message").value("owner not found: " + image.getId()));
    }

    @Test
    @WithMockAgent
    void testUploadImageToSubtask() throws Exception {
        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);
        Mockito.when(subtaskService.find(image.getId())).thenReturn(Optional.of(new Subtask()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "subtask")
                .param("id", image.getId().toString()))
            .andExpect(status().is(200))
            .andExpect(content().string(image.getId().toString()));
    }

    @Test
    @WithMockAgent
    void testUploadImageToSubtask_ownerNotFound() throws Exception {
        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "subtask")
                .param("id", image.getId().toString()))
            .andExpect(status().is4xxClientError())
            .andExpect(jsonPath("$.message").value("owner not found: " + image.getId()));
    }

    @Test
    @WithMockAgent
    void testUploadImageWithNoValidModelName() throws Exception {
        // When
        Mockito.when(imageFileService.save(bytes, FILENAME)).thenReturn(image);

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "not valid")
                .param("id", image.getId().toString()))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("unknown model: not valid"));
    }

    @Test
    @WithMockAgent
    void testUploadImageWithCustomFileName() throws Exception {
        // Given
        String name = "123abcABC#";

        // When
        Mockito.when(imageFileService.save(bytes, name)).thenReturn(image);
        Mockito.when(reportService.find(image.getId())).thenReturn(Optional.of(new Report()));

        // Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/images")
                .file(file)
                .param("modelName", "report")
                .param("id", image.getId().toString())
                .param("fileName", name))
            .andExpect(status().is(200))
            .andExpect(content().string(image.getId().toString()));
    }

    @Test
    @WithMockAgent
    void testUploadImage_failWhenReadingFile() throws Exception {
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
        var request = MockMvcRequestBuilders.multipart("/api/v1/images")
            .file(file2)
            .param("modelName", "subtask")
            .param("id", image.getId().toString());

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
    void testDownloadImage() throws Exception {
        // Given
        Long id = 1L;
        var mockRequest = MockMvcRequestBuilders.get("/api/v1/images/" + id)
            .accept(MediaType.IMAGE_JPEG_VALUE);

        // When
        FileSystemResource resource =
            new FileSystemResource(Paths.get("src/test/resources/testImage/fish.jpeg"));
        Mockito.when(imageFileService.find(id)).thenReturn(Optional.of(resource));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().bytes(resource.getInputStream().readAllBytes()));
    }
}
