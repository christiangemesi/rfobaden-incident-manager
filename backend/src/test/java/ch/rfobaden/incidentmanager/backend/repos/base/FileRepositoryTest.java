package ch.rfobaden.incidentmanager.backend.repos.base;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public abstract class FileRepositoryTest {

    private static final Long TEST_ID = 10L;

    private final FileRepository fileRepository;
    private final String testFile;

    public FileRepositoryTest(FileRepository fileRepository, String testFile) {
        this.fileRepository = fileRepository;
        this.testFile = testFile;
    }

    @AfterEach
    private void cleanUp() throws IOException {
        Files.delete(Paths.get(fileRepository.getResourceDir() + TEST_ID));
    }

    @Test
    void testSave() throws IOException {
        // Given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(testFile));
        byte[] bytes = resourceOut.getInputStream().readAllBytes();

        // When
        fileRepository.save(bytes, TEST_ID);
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
            new FileSystemResource(Paths.get(testFile));
        if (!Files.exists(newFile.getParent())) {
            Files.createDirectories(newFile.getParent());
        }
        Files.write(newFile, resource.getInputStream().readAllBytes());

        // When
        FileSystemResource resourceIn = fileRepository.findInFileSystem(TEST_ID);

        // Then
        assertArrayEquals(
            resource.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }

}
