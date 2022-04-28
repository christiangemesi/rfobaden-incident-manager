package ch.rfobaden.incidentmanager.backend.repos;

import static ch.rfobaden.incidentmanager.backend.repos.DocumentFileRepository.RESOURCES_DIR_DOCUMENTS;
import static ch.rfobaden.incidentmanager.backend.repos.ImageFileRepository.RESOURCES_DIR;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;


import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.models.Image;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class DocumentFileRepositoryTest {

    public static final String PATH_TO_TEST_FILE = "src/test/resources/testImage/blank.pdf";
    public static final Long DOCUMNT_ID = 42L;

    private final ImageFileRepository documentFileRepository;
    private final Document document;

    public DocumentFileRepositoryTest() {
        documentFileRepository = new ImageFileRepository();
        document = new Document("name");
        document.setId(DOCUMNT_ID);
    }

    //TODO change document.getID() + "mimetype"
    @AfterEach
    private void cleanUp() throws IOException {
        Files.delete(Paths.get(RESOURCES_DIR_DOCUMENTS + document.getId() ));
    }

    //TODO change document.getID() + "mimetype"
    @Test
    void testSaveDocument() throws IOException {
        // Given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(PATH_TO_TEST_FILE));
        byte[] bytes = resourceOut.getInputStream().readAllBytes();

        // When
        documentFileRepository.save(bytes, document.getId());
        FileSystemResource resourceIn = new FileSystemResource(
            Paths.get(RESOURCES_DIR_DOCUMENTS + document.getId() ));

        // Then
        assertArrayEquals(
            resourceOut.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }

    //TODO change document.getID() + "mimetype"
    @Test
    void testLoadDocument() throws IOException {
        // Given
        Path newFile = Paths.get(RESOURCES_DIR_DOCUMENTS + document.getId() );
        FileSystemResource resource =
            new FileSystemResource(Paths.get(PATH_TO_TEST_FILE));
        if (!Files.exists(newFile.getParent())) {
            Files.createDirectories(newFile.getParent());
        }
        Files.write(newFile, resource.getInputStream().readAllBytes());

        // When
        FileSystemResource resourceIn = documentFileRepository.findInFileSystem(document.getId());

        // Then
        assertArrayEquals(
            resource.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }

}
