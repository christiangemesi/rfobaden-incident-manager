package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Document;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Repository
public class DocumentFileRepository {
    private static final String RESOURCE_DIR = "files/documents/";

    public void save(Document document, byte[] content) {
        try {
            Path path = buildPath(document);
            if (!Files.exists(path.getParent())) {
                Files.createDirectories(path.getParent());
            }
            Files.write(path, content);
        } catch (IOException e) {
            throw new IllegalStateException("failed to save document file", e);
        }
    }

    public Optional<FileSystemResource> find(Document document) {
        Path path = buildPath(document);
        if (!Files.exists(path)) {
            return Optional.empty();
        }
        return Optional.of(new FileSystemResource(path));
    }

    public boolean delete(Document document) {
        try {
            return Files.deleteIfExists(buildPath(document));
        } catch (IOException e) {
            throw new IllegalStateException("failed to delete document file", e);
        }
    }

    private Path buildPath(Document document) {
        return Paths.get(RESOURCE_DIR + document.getId() + document.getExtension());
    }

    public String getResourceDir() {
        return RESOURCE_DIR;
    }
}
