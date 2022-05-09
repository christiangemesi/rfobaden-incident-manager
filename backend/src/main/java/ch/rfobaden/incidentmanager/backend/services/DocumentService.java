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

    public Document create(Document document, byte[] content) {
        document = repository.save(document);
        fileRepository.save(document, content);
        return document;
    }

    public Optional<Document> findDocument(Long id) {
        return repository.findById(id);
    }

    public Optional<FileSystemResource> loadFile(Long documentId) {
        return repository.findById(documentId).flatMap(this::loadFileByDocument);
    }

    public Optional<FileSystemResource> loadFileByDocument(Document document) {
        return fileRepository.find(document);
    }

    public boolean delete(Long id) {
        return repository.findById(id)
            .map((document) -> {
                repository.delete(document);
                return fileRepository.delete(document);
            })
            .orElse(false);
    }
}
