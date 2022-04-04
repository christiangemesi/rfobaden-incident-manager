package ch.rfobaden.incidentmanager.backend.models;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.Test;

class ImageTest {

    @Test
    void equalsTest() {
        // Given
        Long id = 42L;
        Image image1 = new Image("fish");
        image1.setId(id);
        Image image2 = new Image("fish");
        image2.setId(id);
        
        // Then
        assertEquals(image1, image2);
        assertEquals(image1.hashCode(), image2.hashCode());
    }

    @Test
    void notEqualsTest() {
        // Given
        Image image1 = new Image("fish");
        image1.setId(42L);
        Image image2 = new Image("fish");
        image2.setId(43L);

        // Then
        assertNotEquals(image1, image2);
    }

    @Test
    void notSameClassTest() {
        // Given
        Image image1 = new Image("fish");
        image1.setId(42L);
        Object o = new Object();

        // Then
        assertNotEquals(image1, o);
    }
}
