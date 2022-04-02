package ch.rfobaden.incidentmanager.backend.services;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import ch.rfobaden.incidentmanager.backend.models.Image;
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
class FileLocationServiceTest {

    public static final String IMAGE_NAME = "name";
    public static final String PATH_TO_FILE = "src/test/resources/testImage/fish.jpeg";

    @Autowired
    private FileLocationService fileLocationService;

    @MockBean
    private ImageFileRepository imageFileRepository;

    @MockBean
    private ImageRepository imageRepository;


    @Test
    void saveImageTest() {
        // given
        byte[] bytes = "some data".getBytes();

        // when
        Image img = fileLocationService.save(bytes, IMAGE_NAME);

        // then
        assertEquals(IMAGE_NAME, img.getName());
    }

    @Test
    void findImageTest() throws IOException {
        // given
        String imageName = "name";
        Image image = new Image(imageName);
        image.setId(42L);
        image.setLocation(PATH_TO_FILE);
        FileSystemResource resource =
            new FileSystemResource(Paths.get(PATH_TO_FILE));
        Mockito.when(imageRepository.findById(image.getId())).thenReturn(Optional.of(image));
        Mockito.when(imageFileRepository.findInFileSystem(PATH_TO_FILE)).thenReturn(resource);

        // when
        FileSystemResource fileSystemResource = fileLocationService.find(image.getId());

        // then
        assertArrayEquals(
            fileSystemResource.getInputStream().readAllBytes(),
            resource.getInputStream().readAllBytes()
        );
    }


}
