package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Document;
import ch.rfobaden.incidentmanager.backend.services.DocumentFileService;
import ch.rfobaden.incidentmanager.backend.services.DocumentService;
import org.apache.tika.Tika;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Repository
public class DocumentFileRepository {
    public static final String RESOURCES_DIR = "files/documents/";

    public void save(byte[] content, Long id) {
        try {
            Path newFile = Paths.get(RESOURCES_DIR + id);
            if (!Files.exists(newFile.getParent())) {
                Files.createDirectories(newFile.getParent());
            }
            Files.write(newFile, content);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, e.toString());
        }
    }

    public FileSystemResource findInFileSystem(Long id) {

        return new FileSystemResource(Paths.get(RESOURCES_DIR + id));
    }
}
