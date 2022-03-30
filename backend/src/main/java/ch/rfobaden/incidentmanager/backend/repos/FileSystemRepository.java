package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Image;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Repository;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import javax.imageio.ImageIO;

@Repository
public class FileSystemRepository {
    public static final String RESOURCES_DIR = "files/images";
    public static final String IMAGE_FORMAT = "jpeg";

    public Image save(byte[] content, String imageName) {
        final long dateTime = new Date().getTime();
        Path originalImgPath = Paths.get(
                RESOURCES_DIR + dateTime + "-" + imageName
        );

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(content);
        BufferedImage originalImg;

        try {
            originalImg = ImageIO.read(byteArrayInputStream);
            ImageIO.write(originalImg, IMAGE_FORMAT, new File(originalImgPath.toAbsolutePath().toString()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        Image image = new Image(imageName);
        image.setLocation(originalImgPath.toAbsolutePath().toString());
        return image;
    }

    public FileSystemResource findInFileSystem(String location) {
        return new FileSystemResource(Paths.get(location));
    }
}
