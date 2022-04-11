package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.models.DocumentOwner;
import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.models.ImageOwner;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.services.DocumentFileService;
import ch.rfobaden.incidentmanager.backend.services.ImageFileService;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.function.Supplier;

@RequireAgent
@RestController
@RequestMapping(path = "api/v1/documents")
public class DocumentController {
    private final DocumentFileService documentFileService;
    private final IncidentService incidentService;
    private final ReportService reportService;
    private final TaskService taskService;
    private final SubtaskService subtaskService;


    public DocumentController(
        DocumentFileService documentFileService,
        IncidentService incidentService, ReportService reportService,
        TaskService taskService,
        SubtaskService subtaskService
    ) {
        this.documentFileService = documentFileService;
        this.incidentService = incidentService;
        this.reportService = reportService;
        this.taskService = taskService;
        this.subtaskService = subtaskService;
    }

    //TODO change to smth with pdf?
    @GetMapping(value = "/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public FileSystemResource downloadDocument(@PathVariable Long id) {
        return documentFileService.find(id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "document not found: " + id)
        ));
    }

    @PostMapping
    public Long uploadDocument(
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

        Supplier<Document> saveDocument = () -> (
            documentFileService.save(bytes, fileName.orElseGet(file::getOriginalFilename))
        );
        Document document;
        switch (modelName.toLowerCase()) {
            case "incident":
                //TODO why are all services red?
                document = saveDocumentToEntity(id, incidentService, saveDocument);
                break;
            case "report":
                document = saveDocumentToEntity(id, reportService, saveDocument);
                break;
            case "task":
                document = saveDocumentToEntity(id, taskService, saveDocument);
                break;
            case "subtask":
                document = saveDocumentToEntity(id, subtaskService, saveDocument);
                break;
            default:
                throw new ApiException(HttpStatus.BAD_REQUEST, "unknown model: " + modelName);
        }
        return document.getId();
    }

    private <M extends Model & DocumentOwner & PathConvertible<?>> Document saveDocumentToEntity(
        Long id, ModelService<M, ?> modelService, Supplier<Document> saveDocument
    ) {
        var entity = modelService.find(id).orElseThrow(() -> (
            new ApiException(HttpStatus.BAD_REQUEST, "owner not found: " + id
            )));
        var document = saveDocument.get();
        entity.addDocument(document);
        modelService.update(entity);
        return document;
    }
}
