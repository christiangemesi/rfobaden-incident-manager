package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.repos.DocumentFileRepository;
import ch.rfobaden.incidentmanager.backend.repos.DocumentRepository;
import org.springframework.core.io.FileSystemResource;

import java.util.Optional;

public class DocumentFileService {

    private final DocumentFileRepository documentFileRepository;
    private final DocumentRepository documentRepository;

    public DocumentFileService(
        DocumentFileRepository documentFileRepository,
        DocumentRepository documentRepository
    ) {
        this.documentFileRepository = documentFileRepository;
        this.documentRepository = documentRepository;
    }

    public Optional<FileSystemResource> find(Long documentId) {
        return documentRepository.findById(documentId).map((document) -> (
            documentFileRepository.findInFileSystem(document.getId())
        ));
    }
}
