package ch.rfobaden.incidentmanager.backend.repos.base;

import static ch.rfobaden.incidentmanager.backend.repos.base.FileRepository.RESOURCES_DIR_DOCUMENTS;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;


import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.repos.base.FileRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public abstract class FileRepositoryTest {
/*
    private final FileRepository fileRepository;

    public FileRepositoryTest(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    //TODO change document.getID() + "mimetype"
    @AfterEach
    private void cleanUp() throws IOException {
        Files.delete(Paths.get(fileRepository.getDirectory() + document.getId() ));
    }

    //TODO change document.getID() + "mimetype"
    @Test
    void testSaveDocument() throws IOException {
        // Given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(PATH_TO_TEST_FILE));
        byte[] bytes = resourceOut.getInputStream().readAllBytes();

        // When
        fileRepository.save(bytes, document.getId());
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
        FileSystemResource resourceIn = fileRepository.findInFileSystem(document.getId());

        // Then
        assertArrayEquals(
            resource.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }
*/
}
