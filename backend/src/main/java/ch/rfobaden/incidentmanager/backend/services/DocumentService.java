package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.repos.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;

    public DocumentService(
        DocumentRepository documentRepository
    ) {
        this.documentRepository = documentRepository;
    }

    public Optional<Document> getDocument(Long id){
        return documentRepository.findById(id);
    }
}
