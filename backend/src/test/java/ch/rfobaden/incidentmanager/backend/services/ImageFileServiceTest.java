package ch.rfobaden.incidentmanager.backend.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.repos.ImageFileRepository;
import ch.rfobaden.incidentmanager.backend.repos.base.FileRepository;
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
class ImageFileServiceTest {

    public static final String IMAGE_NAME = "name";
    public static final String PATH_TO_FILE = "src/test/resources/testImage/fish.jpeg";

    @Autowired
    private ImageFileService imageFileService;

    @MockBean
    private ImageFileRepository imageFileRepository;

    @MockBean
    private ImageRepository imageRepository;

    @Test
    void testSaveImage() {
        // Given
        byte[] bytes = "some data".getBytes();
        Image image = new Image(IMAGE_NAME);
        Mockito.when(imageRepository.save(image)).thenReturn(image);

        // When
        Image img = imageFileService.save(bytes, IMAGE_NAME);

        // Then
        assertEquals(IMAGE_NAME, img.getName());
    }

    @Test
    void testFindImage() throws IOException {
        // Given
        String imageName = "name";
        Image image = new Image(imageName);
        image.setId(42L);
        FileSystemResource resource =
            new FileSystemResource(Paths.get(PATH_TO_FILE));
        Mockito.when(imageRepository.findById(image.getId())).thenReturn(Optional.of(image));
        Mockito.when(imageFileRepository.findInFileSystem(image.getId())).thenReturn(resource);

        // When
        var fileSystemResource = imageFileService.find(image.getId()).orElse(null);

        // Then
        assertThat(fileSystemResource).isNotNull();
        assertArrayEquals(
            fileSystemResource.getInputStream().readAllBytes(),
            resource.getInputStream().readAllBytes()
        );
    }
}
