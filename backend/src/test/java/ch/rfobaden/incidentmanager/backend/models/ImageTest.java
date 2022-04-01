package ch.rfobaden.incidentmanager.backend.models;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.Test;

class ImageTest {

    public static final String PATH_TO_FILE = "src/test/resources/testImage/fish.jpeg";

    @Test
    void equalsTest() {
        // given
        Long id = 42L;
        Image image1 = new Image("fish");
        image1.setLocation(PATH_TO_FILE);
        image1.setId(id);
        Image image2 = new Image("fish");
        image2.setLocation(PATH_TO_FILE);
        image2.setId(id);
        
        // then
        assertEquals(image1, image2);
        assertEquals(image1.hashCode(), image2.hashCode());
    }

    @Test
    void notEqualsTest() {
        // given
        Image image1 = new Image("fish");
        image1.setLocation(PATH_TO_FILE);
        image1.setId(42L);
        Image image2 = new Image("fish");
        image2.setLocation(PATH_TO_FILE);
        image2.setId(43L);

        // then
        assertNotEquals(image1, image2);
    }

    @Test
    void notSameClassTest() {
        // given
        Image image1 = new Image("fish");
        image1.setLocation(PATH_TO_FILE);
        image1.setId(42L);
        Object o = new Object();

        // then
        assertNotEquals(image1, o);
    }
}
