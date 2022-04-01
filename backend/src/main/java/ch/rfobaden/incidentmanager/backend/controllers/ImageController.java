package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.models.Report;
import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.services.FileLocationService;
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
import java.util.Map;
import java.util.function.BiConsumer;

@RequireAgent
@RestController
@RequestMapping(path = "api/v1/file-system")
public class ImageController extends AppController {
    private final FileLocationService fileLocationService;
    private final ReportService reportService;
    private final TaskService taskService;
    private final SubtaskService subtaskService;
    private final Map<String, BiConsumer<Image, Long>> mapping;

    public ImageController(
        FileLocationService fileLocationService,
        ReportService reportService,
        TaskService taskService,
        SubtaskService subtaskService
    ) {
        this.fileLocationService = fileLocationService;
        this.reportService = reportService;
        this.taskService = taskService;
        this.subtaskService = subtaskService;

        mapping = Map.of(
            "report",   this::saveImageToReport,
            "task",     this::saveImageToTask,
            "subtask",  this::saveImageToSubtask
        );
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

        Image image = fileLocationService.save(bytes, file.getOriginalFilename());
        mapping.get(modelName).accept(image, id);
        return image.getId();

    }

    @GetMapping(value = "/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public FileSystemResource downloadImage(@RequestParam Long id) {
        return fileLocationService.find(id);
    }

    private void saveImageToReport(Image image, Long id) {
        Report report = reportService.find(id).orElseThrow(
            () -> new ApiException(HttpStatus.NOT_FOUND, "Report not found")
        );
        report.addImage(image);
        reportService.update(report);
    }

    private void saveImageToTask(Image image, Long id) {
        Task task = taskService.find(id).orElseThrow(
            () -> new ApiException(HttpStatus.NOT_FOUND, "Task not found")
        );
        task.addImage(image);
        taskService.update(task);
    }

    private void saveImageToSubtask(Image image, Long id) {
        Subtask subtask = subtaskService.find(id).orElseThrow(
            () -> new ApiException(HttpStatus.NOT_FOUND, "Subtask not found")
        );
        subtask.addImage(image);
        subtaskService.update(subtask);
    }
}
