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

/**
 * {@code DocumentController} implements endpoints to handle file uploads.
 * <p>
 *     Uploaded files are stored as {@link Document documents} and then attached to other entities.
 *     These entities are called the document's <i>owner</i> and have to implement either
 *     {@link DocumentOwner}, {@link ImageOwner}, or both.
 * </p>
 */
@RestController
@RequireAgent
@RequestMapping(path = "api/v1/documents")
public class DocumentController implements AppController {
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

    /**
     * Loads an uploaded file.
     *
     * @param id The id of the document whose file gets loaded.
     * @return The uploaded file contents.
     *
     * @throws ApiException {@link HttpStatus#NOT_FOUND} if no matching document was found.
     */
    @GetMapping(value = "/{id}")
    public ResponseEntity<FileSystemResource> find(@PathVariable Long id) {
        var document = documentService.findDocument(id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "document not found: " + id)
        ));

        var name = document.getName();
        if (name == null) {
            name = document.getId().toString();
        }

        ContentDisposition contentDisposition = ContentDisposition.builder("inline")
            .filename(name + document.getExtension())
            .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(contentDisposition);
        headers.set("Content-Type", document.getMimeType());

        var file = documentService.loadFileByDocument(document).orElseThrow(() -> (
            new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "document file not found: " + id)
        ));
        return ResponseEntity.ok().headers(headers).body(file);
    }

    /**
     * Creates a new document from an uploaded file, and attaches it to a specific entity.
     *
     * @param file The uploaded file.
     * @param modelName The name of the model to which the entity
     *                  that the document gets attached to belongs.
     * @param modelId The id of the model entity to which the document gets attached.
     * @param name The document's filename. Can be empty to use the uploaded file's name.
     * @param type Determines how the documents are attached to their owning entities.
     *             Use {@code "document"} for a {@link DocumentOwner normal document},
     *             and {@code "image"} for {@link ImageOwner images}.
     *             Defaults to {@code "document"} if not specified.
     * @return The newly created document.
     *
     * @throws ApiException {@link HttpStatus#BAD_REQUEST} If the owner entity could not be found.
     *                      {@link HttpStatus#BAD_REQUEST} If the type is invalid.
     */
    @PostMapping
    public Document create(
        @RequestParam MultipartFile file,
        @RequestParam String modelName,
        @RequestParam Long modelId,
        @RequestParam(required = false) Optional<String> name,
        @RequestParam(required = false) Optional<String> type
    ) {
        var service = resolveService(modelName);
        var content = readFile(file);
        var document = buildDocument(file, name, content);

        var saveToOwner = prepareSaveDocument(document, type);
        var owner = service.find(modelId).orElseThrow(() -> (
            new ApiException(HttpStatus.BAD_REQUEST, "owner not found: " + modelId)
        ));

        document = documentService.create(document, content);
        saveToOwner.accept(owner, document);
        service.update(owner);

        return document;
    }

    /**
     * Deletes a document.
     *
     * @param modelName The name of the model to which the document's owning entity belongs.
     * @param modelId The id of the document's owning entity.
     * @param id The document's id.
     * @param type The document's type, see
     *             {@link #create(MultipartFile, String, Long, Optional, Optional)}.
     *
     * @throws ApiException {@link HttpStatus#BAD_REQUEST} If the owner entity could not be found.
     *                      {@link HttpStatus#BAD_REQUEST} If the type is invalid.
     *                      {@link HttpStatus#NOT_FOUND} If no matching document was found.
     */
    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @RequestParam String modelName,
        @RequestParam Long modelId,
        @PathVariable Long id,
        @RequestParam(required = false) Optional<String> type
    ) {
        var service = resolveService(modelName);
        var entity = service.find(modelId).orElseThrow(() -> (
            new ApiException(HttpStatus.BAD_REQUEST, "owner not found: " + id)
        ));
        var actualType = type.orElse("");
        switch (actualType) {
            case "":
            case "document":
                entity.getDocuments().removeIf(document -> document.getId().equals(id));
                break;
            case "image":
                entity.getImages().removeIf(image -> image.getId().equals(id));
                break;
            default:
                throw new ApiException(HttpStatus.BAD_REQUEST, "type not supported: " + id);
        }
        if (!documentService.delete(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "document not found: " + id);
        }
    }

    /**
     * Creates a new {@link Document} instance.
     *
     * @param file The uploaded file.
     * @param name The name to use as the document's filename.
     * @param content The uploaded file's contents.
     * @return The new {@code Document} instance.
     */
    private Document buildDocument(MultipartFile file, Optional<String> name, byte[] content) {
        var mimeType = documentService.detectMimeType(content);

        var document = new Document();
        document.setMimeType(mimeType.toString());
        document.setExtension(mimeType.getExtension());

        String fileName = name.orElseGet(() -> {
            var originalFileName = file.getOriginalFilename();
            if (originalFileName != null) {
                return originalFileName.substring(0, originalFileName.lastIndexOf('.'));
            }
            return null;
        });
        document.setName(fileName);

        return document;
    }

    /**
     * Determines how a document is attached to its owner.
     * Creates a {@link BiConsumer} which accepts the owner and the document entity,
     * and then attaches the document.
     *
     * @param document The document to attach.
     * @param type The type of the document.
     * @param <M> The type of the owning entity.
     * @return A {@link BiConsumer} which attaches a document to its owner.
     *
     * @throws ApiException {@link HttpStatus#BAD_REQUEST} if the {@code type} is invalid.
     */
    private <M extends DocumentOwner & ImageOwner> BiConsumer<M, Document> prepareSaveDocument(
        Document document,
        Optional<String> type
    ) {
        var actualType = type.orElse("");
        switch (actualType) {
            case "":
            case "document":
                return M::addDocument;
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

    /**
     * Maps the name of a model to its service.
     *
     * @param modelName The name of the model.
     * @param <M> The model type.
     * @return The service of the model.
     */
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

    /**
     * Reads an uploaded file's contents.
     *
     * @param file The uploaded file.
     * @return The file's contents.
     */
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
