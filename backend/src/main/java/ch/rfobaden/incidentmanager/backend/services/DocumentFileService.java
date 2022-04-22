package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.repos.DocumentFileRepository;
import ch.rfobaden.incidentmanager.backend.repos.DocumentRepository;
import org.apache.tika.Tika;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
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

    public Document save(byte[] bytes, String documentName) {
        Tika tika = new Tika();
        String mimeType = tika.detect(bytes);

        Document newDocument = new Document(documentName);
        newDocument.setMimeType(mimeType);

        Document document = documentRepository.save(newDocument);
        documentFileRepository.save(bytes, document.getId());
        return document;
    }

    public Optional<FileSystemResource> find(Long documentId) {
        return documentRepository.findById(documentId).map((document) -> (
            documentFileRepository.findInFileSystem(document.getId())
        ));
    }

    public Optional<Document> getDocument(Long id){
        return documentRepository.findById(id);
    }

}
