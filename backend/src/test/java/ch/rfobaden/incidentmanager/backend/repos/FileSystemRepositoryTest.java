package ch.rfobaden.incidentmanager.backend.repos;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;


class FileSystemRepositoryTest {

    private final FileSystemRepository fileSystemRepository;

    public static final String PATH_TO_FILE = "src/test/resources/testImage/fish.jpeg";

    public FileSystemRepositoryTest() {
        this.fileSystemRepository = new FileSystemRepository();
    }

    @Test
    void saveImageTest() throws IOException {
        // given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(PATH_TO_FILE));
        byte[] bytes = resourceOut.getInputStream().readAllBytes();

        // when
        String location = fileSystemRepository.save(bytes, "testfile.jpeg");
        FileSystemResource resourceIn = new FileSystemResource(Paths.get(location));
        // then
        assertArrayEquals(
            resourceOut.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );

        Files.delete(Paths.get(location));
    }

    @Test
    void loadImageTest() throws IOException {
        // given
        FileSystemResource resourceOut =
            new FileSystemResource(Paths.get(PATH_TO_FILE));

        // when
        FileSystemResource resourceIn = fileSystemRepository.findInFileSystem(PATH_TO_FILE);

        // then
        assertArrayEquals(
            resourceOut.getInputStream().readAllBytes(),
            resourceIn.getInputStream().readAllBytes()
        );
    }
}
