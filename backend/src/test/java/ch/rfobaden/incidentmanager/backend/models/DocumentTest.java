package ch.rfobaden.incidentmanager.backend.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.Test;

public class DocumentTest {

    @Test
    void equalsTest() {
        // Given
        Long id = 42L;
        Document document1 = new Document("blank");
        document1.setId(id);
        Document document2 = new Document("blank");
        document2.setId(id);

        // Then
        assertEquals(document1, document2);
        assertEquals(document1.hashCode(), document2.hashCode());
    }

    @Test
    void notEqualsTest() {
        // Given
        Document document1 = new Document("blank");
        document1.setId(42L);
        Document document2 = new Document("blank");
        document2.setId(43L);

        // Then
        assertNotEquals(document1, document2);
    }

    @Test
    void notSameClassTest() {
        // Given
        Document document1 = new Document("fish");
        document1.setId(42L);
        Object o = new Object();

        // Then
        assertNotEquals(document1, o);
    }
}
