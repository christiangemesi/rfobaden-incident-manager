package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Repository
public class FileRepository {
    public static final String RESOURCES_DIR_IMAGES = "files/images/";
    public static final String RESOURCES_DIR_DOCUMENTS = "files/documents/";

    public void save(byte[] content, Long id) {
        try {
            String fileExtension = findExtensionOfFile(content);
            Path newFile = Paths.get(RESOURCES_DIR_DOCUMENTS + id + "." + fileExtension);
            if (!Files.exists(newFile.getParent())) {
                Files.createDirectories(newFile.getParent());
            }
            Files.write(newFile, content);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, e.toString());
        }
    }

    public String findExtensionOfFile(byte[] content) {
        try {
            InputStream is = new ByteArrayInputStream(content);
            String mimeType = URLConnection.guessContentTypeFromStream(is);
            return FilenameUtils.getExtension(mimeType);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, e.toString());
        }
    }

    //TODO how do i get extension here? only with id?
    public FileSystemResource findInFileSystem(Long id) {
        return new FileSystemResource(Paths.get(RESOURCES_DIR_IMAGES + id));
    }
}
