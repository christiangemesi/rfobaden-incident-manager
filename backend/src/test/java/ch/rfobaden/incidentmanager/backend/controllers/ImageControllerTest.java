package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.services.FileLocationService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ReportController.class)
public class ImageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReportService reportService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private SubtaskService subtaskService;
    @Autowired
    private FileLocationService fileLocationService;


    @Test
    void uploadImageToReportTest () throws Exception {
        byte[] bytes = "some data".getBytes();
        String filename = "filename.jpg";
        String modelName = "report";

        MockMultipartFile firstFile = new MockMultipartFile("name", filename, "multipart/form-data", bytes);
        Mockito.when(fileLocationService.save(bytes, filename)).thenReturn(new Image(filename));

//        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/file-system/image?modelName=" + modelName + "&id=1")
//                .file(firstFile)
//                .param("some-random", "4"))
//            .andExpect(status().is(200))
//            .andExpect(content().string("success"));
    }
}
