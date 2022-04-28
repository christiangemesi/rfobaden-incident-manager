package ch.rfobaden.incidentmanager.backend.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.repos.DocumentFileRepository;
import ch.rfobaden.incidentmanager.backend.repos.DocumentRepository;
import ch.rfobaden.incidentmanager.backend.repos.ImageFileRepository;
import ch.rfobaden.incidentmanager.backend.repos.ImageRepository;
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
public class DocumentFileServiceTest {

    public static final String DOCUMENT_NAME = "name";
    public static final String PATH_TO_FILE = "src/test/resources/testImage/blank.pdf";

    @Autowired
    private DocumentFileService documentFileService;

    @MockBean
    private ImageFileRepository documentFileRepository;

    @MockBean
    private DocumentRepository documentRepository;

    @Test
    void testSaveDocument() {
        // Given
        byte[] bytes = "some data".getBytes();
        Document document = new Document(DOCUMENT_NAME);
        Mockito.when(documentRepository.save(document)).thenReturn(document);

        //TODO why is Document null?`documentFileService.save creates a new Document and sets all overhead
        // When
        Document doc = documentFileService.save(bytes, DOCUMENT_NAME);

        // Then
        assertEquals(DOCUMENT_NAME, doc.getName());
    }

    @Test
    void testFindDocument() throws IOException {
        // Given
        String documentName = "name";
        Document document = new Document(documentName);
        document.setId(42L);
        FileSystemResource resource =
            new FileSystemResource(Paths.get(PATH_TO_FILE));
        Mockito.when(documentRepository.findById(document.getId())).thenReturn(Optional.of(document));
        Mockito.when(documentFileRepository.findInFileSystem(document.getId())).thenReturn(resource);

        // When
        var fileSystemResource = documentFileService.find(document.getId()).orElse(null);

        // Then
        assertThat(fileSystemResource).isNotNull();
        assertArrayEquals(
            fileSystemResource.getInputStream().readAllBytes(),
            resource.getInputStream().readAllBytes()
        );
    }


}
