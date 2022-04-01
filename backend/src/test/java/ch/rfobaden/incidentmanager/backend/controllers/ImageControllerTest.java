package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
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



}
