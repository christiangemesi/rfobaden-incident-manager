package ch.rfobaden.incidentmanager.backend.repos;

import static org.junit.jupiter.api.Assertions.assertEquals;

import ch.rfobaden.incidentmanager.backend.models.Document;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class DocumentRepositoryTest {

    @Autowired
    DocumentRepository documentRepository;

    @Test
    void testFindById() {
        // Given
        Document document = new Document("blank");
        document.setExtension("pdf");
        document.setMimeType("Application/pdf");

        // When
        Document doc = documentRepository.save(document);
        Document savedDocument = documentRepository.findById(doc.getId()).orElse(null);

        // Then
        assertEquals(1, documentRepository.findAll().size());
        assertEquals(doc, savedDocument);
    }

    @Test
    void testFindAll() {
        // Given
        Document document1 = new Document("fish");
        document1.setExtension("pdf");
        document1.setMimeType("Application/pdf");

        Document document2 = new Document("fish");
        document2.setExtension("pdf");
        document2.setMimeType("Application/pdf");

        Document document3 = new Document("fish");
        document3.setExtension("pdf");
        document3.setMimeType("Application/pdf");

        // When
        documentRepository.save(document1);
        documentRepository.save(document2);
        documentRepository.save(document3);

        // Then
        assertEquals(3, documentRepository.findAll().size());
    }

    @Test
    void testDeleteImage() {
        // Given
        Document document1 = new Document("fish");
        document1.setExtension("pdf");
        document1.setMimeType("Application/pdf");

        Document document2 = new Document("fish");
        document2.setExtension("pdf");
        document2.setMimeType("Application/pdf");

        Document document3 = new Document("fish");
        document3.setExtension("pdf");
        document3.setMimeType("Application/pdf");

        // When
        documentRepository.save(document1);
        Document toDelete = documentRepository.save(document2);
        documentRepository.save(document3);

        // Then
        assertEquals(3, documentRepository.findAll().size());
        documentRepository.delete(toDelete);
        assertEquals(2, documentRepository.findAll().size());
    }

}
