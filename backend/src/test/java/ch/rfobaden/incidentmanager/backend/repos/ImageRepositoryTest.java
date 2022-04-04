package ch.rfobaden.incidentmanager.backend.repos;

import static org.junit.jupiter.api.Assertions.assertEquals;

import ch.rfobaden.incidentmanager.backend.models.Image;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class ImageRepositoryTest {

    @Autowired
    ImageRepository imageRepository;

    @Test
    void testFindById() {
        // Given
        Image image = new Image("fish");

        // When
        Image img = imageRepository.save(image);
        Image savedImage = imageRepository.findById(img.getId()).orElse(null);

        // Then
        assertEquals(1, imageRepository.findAll().size());
        assertEquals(img, savedImage);
    }

    @Test
    void testFindAll() {
        // Given
        Image image1 = new Image("fish");
        Image image2 = new Image("fish");
        Image image3 = new Image("fish");

        // When
        imageRepository.save(image1);
        imageRepository.save(image2);
        imageRepository.save(image3);

        // Then
        assertEquals(3, imageRepository.findAll().size());
    }

    @Test
    void testDeleteImage() {
        // Given
        Image image1 = new Image("fish");
        Image image2 = new Image("fish");
        Image image3 = new Image("fish");

        // When
        imageRepository.save(image1);
        Image toDelete = imageRepository.save(image2);
        imageRepository.save(image3);

        // Then
        assertEquals(3, imageRepository.findAll().size());
        imageRepository.delete(toDelete);
        assertEquals(2, imageRepository.findAll().size());
    }
}