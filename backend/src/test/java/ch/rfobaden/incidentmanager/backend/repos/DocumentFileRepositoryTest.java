package ch.rfobaden.incidentmanager.backend.repos;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import ch.rfobaden.incidentmanager.backend.models.Document;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@SpringBootTest
class DocumentFileRepositoryTest {

    public static final String PATH_TO_TEST_FILE = "src/test/resources/files/blank.pdf";

    private static final Long TEST_ID = 10L;

    @Autowired
    private DocumentFileRepository fileRepository;

    @AfterEach
    private void cleanUp() throws IOException {
        Files.delete(Paths.get(fileRepository.getResourceDir() + TEST_ID));
    }

    @Test
    void testSave() throws IOException {
        // Given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(PATH_TO_TEST_FILE));
        byte[] bytes = resourceOut.getInputStream().readAllBytes();

        var document = new Document();
        document.setId(TEST_ID);
        document.setExtension("");

        // When
        fileRepository.save(document, bytes);
        FileSystemResource resourceIn = new FileSystemResource(
            Paths.get(fileRepository.getResourceDir() + TEST_ID));

        // Then
        assertArrayEquals(
            resourceOut.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }

    @Test
    void testLoad() throws IOException {
        // Given
        Path newFile = Paths.get(fileRepository.getResourceDir() + TEST_ID);
        FileSystemResource resource =
            new FileSystemResource(Paths.get(PATH_TO_TEST_FILE));
        if (!Files.exists(newFile.getParent())) {
            Files.createDirectories(newFile.getParent());
        }
        Files.write(newFile, resource.getInputStream().readAllBytes());

        var document = new Document();
        document.setId(TEST_ID);
        document.setExtension("");

        // When
        Optional<FileSystemResource> result = fileRepository.find(document);

        // Then
        assertThat(result).isPresent();
        assertArrayEquals(
            resource.getInputStream().readAllBytes(),
            result.get().getInputStream().readAllBytes()
        );
    }
}
