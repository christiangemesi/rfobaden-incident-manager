package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.repos.DocumentRepository;
import ch.rfobaden.incidentmanager.backend.repos.base.FileRepository;
import org.apache.tika.Tika;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DocumentFileService {

    private final FileRepository fileRepository;
    private final DocumentRepository documentRepository;

    public DocumentFileService(
        FileRepository fileRepository,
        DocumentRepository documentRepository
    ) {
        this.fileRepository = fileRepository;
        this.documentRepository = documentRepository;
    }

    public Document save(byte[] bytes, String documentName) {
        Tika tika = new Tika();
        String mimeType = tika.detect(bytes);

        Document newDocument = new Document(documentName);
        newDocument.setMimeType(mimeType);

        Document document = documentRepository.save(newDocument);
        fileRepository.save(bytes, document.getId());
        return document;
    }

    public Optional<FileSystemResource> findFile(Long documentId) {
        return documentRepository.findById(documentId).map((document) -> (
            fileRepository.findInFileSystem(document.getId())
        ));
    }

    public FileSystemResource findFileByDocument(Document document) {
        return fileRepository.findInFileSystem(document.getId());
    }

    public Optional<Document> findDocument(Long id){
        return documentRepository.findById(id);
    }

}
