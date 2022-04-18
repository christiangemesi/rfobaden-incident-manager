package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.models.ImageOwner;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.services.ImageFileService;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.function.Supplier;
import javax.websocket.server.PathParam;


@RestController
@RequestMapping(path = "api/v1/images")
public class ImageController extends AppController {
    private final ImageFileService imageFileService;
    private final IncidentService incidentService;
    private final ReportService reportService;
    private final TaskService taskService;
    private final SubtaskService subtaskService;

    public ImageController(
        ImageFileService imageFileService,
        IncidentService incidentService, ReportService reportService,
        TaskService taskService,
        SubtaskService subtaskService
    ) {
        this.imageFileService = imageFileService;
        this.incidentService = incidentService;
        this.reportService = reportService;
        this.taskService = taskService;
        this.subtaskService = subtaskService;
    }

    @GetMapping(value = "/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public FileSystemResource downloadImage(@PathVariable Long id) {
        return imageFileService.find(id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "image not found: " + id)
        ));
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImage(@PathVariable Long id) {
        if (!imageFileService.delete(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "image not found: " + id);
        }
    }

    @RequireAgent
    @PostMapping
    public Long uploadImage(
        @RequestParam MultipartFile file,
        @RequestParam String modelName,
        @RequestParam Long id,
        @RequestParam Optional<String> fileName
    ) {
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new ApiException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "failed to read uploaded file: " + e.getMessage()
            );
        }

        Supplier<Image> saveImage = () -> (
            imageFileService.save(bytes, fileName.orElseGet(file::getOriginalFilename))
        );
        Image image;
        switch (modelName.toLowerCase()) {
            case "incident":
                image = saveImageToEntity(id, incidentService, saveImage);
                break;
            case "report":
                image = saveImageToEntity(id, reportService, saveImage);
                break;
            case "task":
                image = saveImageToEntity(id, taskService, saveImage);
                break;
            case "subtask":
                image = saveImageToEntity(id, subtaskService, saveImage);
                break;
            default:
                throw new ApiException(HttpStatus.BAD_REQUEST, "unknown model: " + modelName);
        }
        return image.getId();
    }

    private <M extends Model & ImageOwner & PathConvertible<?>> Image saveImageToEntity(
        Long id, ModelService<M, ?> modelService, Supplier<Image> saveImage
    ) {
        var entity = modelService.find(id).orElseThrow(() -> (
            new ApiException(HttpStatus.BAD_REQUEST, "owner not found: " + id
            )));
        var image = saveImage.get();
        entity.addImage(image);
        modelService.update(entity);
        return image;
    }
}
