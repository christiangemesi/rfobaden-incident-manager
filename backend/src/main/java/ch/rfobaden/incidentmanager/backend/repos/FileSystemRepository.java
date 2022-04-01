package ch.rfobaden.incidentmanager.backend.repos;

import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

@Repository
public class FileSystemRepository {
    public static final String RESOURCES_DIR = "files/images";

    public String save(byte[] content, String imageName) {
        Path newFile = Paths.get(RESOURCES_DIR + new Date().getTime() + "-" + imageName);

        try {
            Files.write(newFile, content);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return newFile.toAbsolutePath().toString();
    }

    public FileSystemResource findInFileSystem(String location) {
        return new FileSystemResource(Paths.get(location));
    }
}
