package testImage;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.apache.tika.Tika;
import org.junit.jupiter.api.Test;


public class findFileTypeTest {

    @Test
    public void whenUsingTikaMimeType() {

        String filepath = "blanc.pdf";
        Tika tika = new Tika();
        String mimeType = tika.detect(filepath);

        assertEquals(mimeType, "application/pdf");
    }
}
