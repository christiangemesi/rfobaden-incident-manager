package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.services.ImageFileService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequireAgent
@RestController
@RequestMapping(path = "api/v1/file-system")
public class ImageController extends AppController {
    private final ImageFileService imageFileService;
    private final ReportService reportService;
    private final TaskService taskService;
    private final SubtaskService subtaskService;

    public ImageController(
        ImageFileService imageFileService,
        ReportService reportService,
        TaskService taskService,
        SubtaskService subtaskService
    ) {
        this.imageFileService = imageFileService;
        this.reportService = reportService;
        this.taskService = taskService;
        this.subtaskService = subtaskService;
    }

    @PostMapping("/image")
    public Long uploadImage(
        @RequestParam MultipartFile file,
        @RequestParam String modelName,
        @RequestParam Long id) {

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        Image image = imageFileService.save(bytes, file.getOriginalFilename());

        switch (modelName.toLowerCase()) {
            case "report":
                saveImageToReport(id, image);
                break;
            case "task":
                saveImageToTask(id, image);
                break;
            case "subtask":
                saveImageToSubtask(id, image);
                break;
            default:
                throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "ModelName not found");
        }
        return image.getId();
    }

    @GetMapping(value = "/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public FileSystemResource downloadImage(@RequestParam Long id) {
        return imageFileService.find(id);
    }

    private void saveImageToReport(Long id, Image image) {
        Report report = reportService.find(id).orElseThrow(
            () -> new ApiException(HttpStatus.NOT_FOUND, "Report not found")
        );
        report.addImage(image);
        reportService.update(report);
    }

    private void saveImageToTask(Long id, Image image) {
        Task task = taskService.find(id).orElseThrow(
            () -> new ApiException(HttpStatus.NOT_FOUND, "Task not found")
        );
        task.addImage(image);
        taskService.update(task);
    }

    private void saveImageToSubtask(Long id, Image image) {
        Subtask subtask = subtaskService.find(id).orElseThrow(
            () -> new ApiException(HttpStatus.NOT_FOUND, "Subtask not found")
        );
        subtask.addImage(image);
        subtaskService.update(subtask);
    }
}
