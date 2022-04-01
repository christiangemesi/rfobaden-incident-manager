package ch.rfobaden.incidentmanager.backend.repos;

import static org.junit.jupiter.api.Assertions.assertEquals;

import ch.rfobaden.incidentmanager.backend.models.Image;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class ImageRepositoryTest {

    public static final String PATH_TO_FILE = "src/test/resources/testImage/fish.jpeg";


    @Autowired
    ImageRepository imageRepository;

    @Test
    void findByIdTest() {
        // given
        Image image = new Image("fish");
        image.setLocation(PATH_TO_FILE);

        // when
        Image img = imageRepository.save(image);
        Image savedImage = imageRepository.findById(img.getId()).orElse(null);

        // then
        assertEquals(1, imageRepository.findAll().size());
        assertEquals(img, savedImage);
    }

    @Test
    void findAllTest() {
        // given
        Image image1 = new Image("fish");
        Image image2 = new Image("fish");
        Image image3 = new Image("fish");
        image1.setLocation(PATH_TO_FILE);
        image2.setLocation(PATH_TO_FILE);
        image3.setLocation(PATH_TO_FILE);

        // when
        imageRepository.save(image1);
        imageRepository.save(image2);
        imageRepository.save(image3);

        // then
        assertEquals(3, imageRepository.findAll().size());
    }

    @Test
    void deleteImageTest() {
        // given
        Image image1 = new Image("fish");
        Image image2 = new Image("fish");
        Image image3 = new Image("fish");
        image1.setLocation(PATH_TO_FILE);
        image2.setLocation(PATH_TO_FILE);
        image3.setLocation(PATH_TO_FILE);

        // when
        imageRepository.save(image1);
        Image toDelete = imageRepository.save(image2);
        imageRepository.save(image3);

        // then
        assertEquals(3, imageRepository.findAll().size());
        imageRepository.delete(toDelete);
        assertEquals(2, imageRepository.findAll().size());

    }
}
