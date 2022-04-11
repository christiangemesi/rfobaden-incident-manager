package testImage;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import java.io.File;
import java.net.URLConnection;

public class findFileTypeTest {

    @Test
    public void whenUsingGetContentType_thenSuccess(){
        File file = new File("blank.pdf");
        String mimeType = URLConnection.guessContentTypeFromName(file.getName());

        assertEquals(mimeType, "application/pdf");
    }
}
