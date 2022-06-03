package ch.rfobaden.incidentmanager.backend.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;

import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.repos.DocumentFileRepository;
import ch.rfobaden.incidentmanager.backend.repos.DocumentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Optional;

@SpringBootTest
class DocumentServiceTest {

    public static final String DOCUMENT_NAME = "name";
    public static final String PATH_TO_FILE = "src/test/resources/files/blank.pdf";

    @Autowired
    private DocumentService documentService;

    @MockBean
    private DocumentFileRepository documentFileRepository;

    @MockBean
    private DocumentRepository documentRepository;

    @Test
    void testSaveDocument() {
        // Given
        byte[] bytes = "some data".getBytes();
        Document document = new Document(DOCUMENT_NAME);
        Mockito.when(documentRepository.save(any())).thenReturn(document);

        Document doc = documentService.create(document, bytes);

        // Then
        assertEquals(DOCUMENT_NAME, doc.getName());
    }

    @Test
    void testFindDocument() {
        // Given
        String documentName = "name";
        Document document = new Document(documentName);
        document.setId(42L);
        FileSystemResource resource =
            new FileSystemResource(Paths.get(PATH_TO_FILE));
        Mockito.when(documentRepository.findById(document.getId()))
            .thenReturn(Optional.of(document));
        Mockito.when(documentFileRepository.find(document))
            .thenReturn(Optional.of(resource));

        // When
        var fileSystemResource = documentService.loadFile(document.getId()).orElse(null);

        // Then
        assertThat(fileSystemResource).isNotNull();
        assertThat(fileSystemResource).isEqualTo(resource);
    }
}
