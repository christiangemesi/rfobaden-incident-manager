package ch.rfobaden.incidentmanager.backend.repos.base;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


public abstract class FileRepository {
    public final String resourceDir;

    public FileRepository(String resourceDir) {
        this.resourceDir = resourceDir;
    }

    public void save(byte[] content, Long id) {
        try {
            Path newFile = Paths.get(resourceDir + id);
            if (!Files.exists(newFile.getParent())) {
                Files.createDirectories(newFile.getParent());
            }
            Files.write(newFile, content);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, e.toString());
        }
    }

    public FileSystemResource findInFileSystem(Long id) {
        return new FileSystemResource(Paths.get(resourceDir + id));
    }

    public boolean delete(Long id) {
        Path file = Paths.get(resourceDir + id);
        try {
            Files.delete(file);
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    public String getResourceDir() {
        return resourceDir;
    }
}
