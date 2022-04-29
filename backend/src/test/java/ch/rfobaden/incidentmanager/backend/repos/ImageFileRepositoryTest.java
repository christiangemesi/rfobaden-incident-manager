package ch.rfobaden.incidentmanager.backend.repos;

import static ch.rfobaden.incidentmanager.backend.repos.ImageFileRepository.RESOURCES_DIR;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.WithMockAgent;
import ch.rfobaden.incidentmanager.backend.models.Image;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

class ImageFileRepositoryTest {

    public static final String PATH_TO_TEST_FILE = "src/test/resources/testImage/fish.jpeg";
    public static final Long IMAGE_ID = 42L;

    private final ImageFileRepository imageFileRepository;
    private final Image image;

    public ImageFileRepositoryTest() {
        imageFileRepository = new ImageFileRepository();
        image = new Image("name");
        image.setId(IMAGE_ID);
    }

    @AfterEach
    private void cleanUp() throws IOException {
        var path = Paths.get(RESOURCES_DIR + image.getId() + ".jpeg");
        if (Files.exists(path)) {
            Files.delete(path);
        }
    }

    @Test
    void testSaveImage() throws IOException {
        // Given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(PATH_TO_TEST_FILE));
        byte[] bytes = resourceOut.getInputStream().readAllBytes();

        // When
        imageFileRepository.save(bytes, image.getId());
        FileSystemResource resourceIn = new FileSystemResource(
            Paths.get(RESOURCES_DIR + image.getId() + ".jpeg"));

        // Then
        assertArrayEquals(
            resourceOut.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }

    @Test
    void testLoadImage() throws IOException {
        // Given
        Path newFile = Paths.get(RESOURCES_DIR + image.getId() + ".jpeg");
        FileSystemResource resource =
            new FileSystemResource(Paths.get(PATH_TO_TEST_FILE));
        if (!Files.exists(newFile.getParent())) {
            Files.createDirectories(newFile.getParent());
        }
        Files.write(newFile, resource.getInputStream().readAllBytes());

        // When
        FileSystemResource resourceIn = imageFileRepository.findInFileSystem(image.getId());

        // Then
        assertArrayEquals(
            resource.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }

    @Test
    void testDeleteImage() throws IOException {
        // Given
        Path newFile = Paths.get(RESOURCES_DIR + image.getId() + ".jpeg");
        FileSystemResource resource =
            new FileSystemResource(Paths.get(PATH_TO_TEST_FILE));
        if (!Files.exists(newFile.getParent())) {
            Files.createDirectories(newFile.getParent());
        }
        Files.write(newFile, resource.getInputStream().readAllBytes());

        // When
        imageFileRepository.delete(image.getId());

        // Then
        assertFalse(Files.exists(newFile));
    }
}
