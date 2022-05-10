package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.AppController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.models.DocumentOwner;
import ch.rfobaden.incidentmanager.backend.models.ImageOwner;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.services.DocumentService;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import ch.rfobaden.incidentmanager.backend.services.ReportService;
import ch.rfobaden.incidentmanager.backend.services.SubtaskService;
import ch.rfobaden.incidentmanager.backend.services.TaskService;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import java.util.function.BiConsumer;

@RestController
@RequestMapping(path = "api/v1/documents")
public class DocumentController extends AppController {
    private final DocumentService documentService;
    private final IncidentService incidentService;
    private final ReportService reportService;
    private final TaskService taskService;
    private final SubtaskService subtaskService;

    public DocumentController(
        DocumentService documentService,
        IncidentService incidentService,
        ReportService reportService,
        TaskService taskService,
        SubtaskService subtaskService
    ) {
        this.documentService = documentService;
        this.incidentService = incidentService;
        this.reportService = reportService;
        this.taskService = taskService;
        this.subtaskService = subtaskService;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<FileSystemResource> find(@PathVariable Long id) {
        var document = documentService.findDocument(id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "document not found: " + id)
        ));
        var file = documentService.loadFileByDocument(document).orElseThrow(() -> (
            new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "document file not found: " + id)
        ));;

        ContentDisposition contentDisposition = ContentDisposition.builder("inline")
            .filename(document.getName() == null
                ? document.getId() + document.getExtension()
                : document.getName()
            )
            .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(contentDisposition);
        headers.set("Content-Type", document.getMimeType());
        return ResponseEntity.ok().headers(headers).body(file);
    }

    @RequireAgent
    @PostMapping
    public Long create(
        @RequestParam MultipartFile file,
        @RequestParam String modelName,
        @RequestParam Long modelId,
        @RequestParam(required = false) Optional<String> name,
        @RequestParam(required = false) Optional<String> type
    ) {
        var service = resolveService(modelName);
        var content = readFile(file);
        var document = buildDocument(file, name, content);

        var saveToOwner = prepareOwner(document, type);
        var owner = service.find(modelId).orElseThrow(() -> (
            new ApiException(HttpStatus.BAD_REQUEST, "owner not found: " + modelId)
        ));

        document = documentService.create(document, content);
        saveToOwner.accept(owner, document);
        service.update(owner);

        return document.getId();
    }

    @RequireAgent
    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @RequestParam String modelName,
        @RequestParam Long modelId,
        @PathVariable Long id
    ) {
        var service = resolveService(modelName);
        var entity = service.find(modelId).orElseThrow(() -> (
            new ApiException(HttpStatus.BAD_REQUEST, "owner not found: " + id)
        ));
        entity.getDocuments().removeIf((document) -> document.getId().equals(id));
        if (!documentService.delete(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "document not found: " + id);
        }
    }

    private Document buildDocument(MultipartFile file, Optional<String> name, byte[] content) {
        var mimeType = documentService.detectMimeType(content);

        var document = new Document();
        document.setMimeType(mimeType.toString());
        document.setExtension(mimeType.getExtension());

        var fileName = name.orElseGet(file::getOriginalFilename);
        if (fileName != null && !fileName.endsWith(document.getExtension())) {
            fileName = fileName + document.getExtension();
        }
        document.setName(fileName);
        return document;
    }

    private <M extends DocumentOwner & ImageOwner> BiConsumer<M, Document> prepareOwner(
        Document document,
        Optional<String> type
    ) {
        var actualType = type.orElse("");
        switch (actualType) {
            case "":
                return M::addImage;
            case "image":
                if (!document.getMimeType().startsWith("image/")) {
                    throw new ApiException(HttpStatus.BAD_REQUEST, "file must be an image");
                }
                return M::addImage;
            default:
                throw new ApiException(HttpStatus.BAD_REQUEST,
                    "unknown document type: " + actualType);
        }
    }

    @SuppressWarnings("unchecked")
    private <M extends Model & PathConvertible<?> & DocumentOwner & ImageOwner>
        ModelService<M, ?> resolveService(String modelName) {

        switch (modelName.toLowerCase()) {
            case "incident":
                return (ModelService<M, ?>) incidentService;
            case "report":
                return (ModelService<M, ?>) reportService;
            case "task":
                return (ModelService<M, ?>) taskService;
            case "subtask":
                return (ModelService<M, ?>) subtaskService;
            default:
                throw new ApiException(HttpStatus.BAD_REQUEST, "unknown model: " + modelName);
        }
    }

    private static byte[] readFile(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new ApiException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "failed to read uploaded file: " + e.getMessage()
            );
        }
    }
}
