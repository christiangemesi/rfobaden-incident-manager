package ch.rfobaden.incidentmanager.backend.repos;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;


class ImageFileRepositoryTest {

    private final ImageFileRepository imageFileRepository;

    public static final String PATH_TO_FILE = "src/test/resources/testImage/fish.jpeg";

    public ImageFileRepositoryTest() {
        this.imageFileRepository = new ImageFileRepository();
    }

    @AfterEach
    private void cleanUp(String fileLocation){
    }

    @Test
    void saveImageTest() throws IOException {
        // Given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(PATH_TO_FILE));
        byte[] bytes = resourceOut.getInputStream().readAllBytes();

        // When
        String location = imageFileRepository.save(bytes, "testfile.jpeg");
        FileSystemResource resourceIn = new FileSystemResource(Paths.get(location));
        // Then
        assertArrayEquals(
            resourceOut.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
// TODO
    }

    @Test
    void loadImageTest() throws IOException {
        // Given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(PATH_TO_FILE));

        // When
        FileSystemResource resourceIn = imageFileRepository.findInFileSystem(PATH_TO_FILE);

        // Then
        assertArrayEquals(
            resourceOut.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }
}
