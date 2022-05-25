package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.repos.DocumentFileRepository;
import ch.rfobaden.incidentmanager.backend.repos.DocumentRepository;
import org.apache.tika.Tika;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * {@code DocumentService} defines CRUD methods for {@link Document} entities.
 */
@Service
public class DocumentService {
    private final DocumentRepository repository;
    private final DocumentFileRepository fileRepository;

    public DocumentService(
        DocumentRepository repository,
        DocumentFileRepository fileRepository
    ) {
        this.repository = repository;
        this.fileRepository = fileRepository;
    }

    /**
     * Detects a file's mime type by inspecting its contents.
     *
     * @param content The file's contents.
     * @return The mime type.
     *
     * @throws IllegalStateException If the mime type could not be found.
     */
    public MimeType detectMimeType(byte[] content) {
        try {
            String mimeTypeName = new Tika().detect(content);
            var mimeType = MimeTypes.getDefaultMimeTypes().forName(mimeTypeName);
            if (mimeType == null) {
                throw new IllegalStateException("mime type not found: " + mimeTypeName);
            }
            return mimeType;
        } catch (MimeTypeException e) {
            throw new IllegalStateException("failed to detect mime type for document", e);
        }
    }

    /**
     * Attempts to load a document with a specific id.
     *
     * @param id The id of the document.
     * @return An {@link Optional} containing the document,
     *         or {@link Optional#empty()}, if no matching document exists.
     */
    public Optional<Document> findDocument(Long id) {
        return repository.findById(id);
    }

    /**
     * Attempts to load the file of a document with a specific id.
     *
     * @param documentId The id of the document whose file gets loaded.
     * @return An {@link Optional} containing the document's file,
     *         or {@link Optional#empty()}, if no matching document exists.
     */
    public Optional<FileSystemResource> loadFile(Long documentId) {
        return repository.findById(documentId).flatMap(this::loadFileByDocument);
    }

    /**
     * Attempts to load the file of a document.
     *
     * @param document The document whose file gets loaded.
     * @return An {@link Optional} containing the document's file,
     *         or {@link Optional#empty()}, if no matching document exists.
     */
    public Optional<FileSystemResource> loadFileByDocument(Document document) {
        return fileRepository.find(document);
    }

    /**
     * Saves a document and its file.
     *
     * @param document The document to save.
     * @param content The contents of the document's file.
     * @return The newly saved document.
     */
    public Document create(Document document, byte[] content) {
        document = repository.save(document);
        fileRepository.save(document, content);
        return document;
    }

    public boolean delete(Long id) {
        return repository.findById(id)
            .map(document -> {
                repository.delete(document);
                return fileRepository.delete(document);
            })
            .orElse(false);
    }
}
