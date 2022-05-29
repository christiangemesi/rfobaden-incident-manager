package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Document;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

/**
 * {@code DocumentFileRepository} stores and loads the actual files of {@link Document} entities.
 */
@Repository
public class DocumentFileRepository {
    /**
     * The directory at which the files are stored, relative to the project root.
     */
    private static final String RESOURCE_DIR = "files/documents/";

    /**
     * Saves a document's file.
     *
     * @param document The document to which the file belongs.
     * @param content The content of the file.
     *
     * @throws IllegalStateException if the file could not be saved.
     */
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

    /**
     * Attempts to load a document's file.
     *
     * @param document The document whose file gets loaded.
     * @return An {@link Optional} containing the file's data,
     *         or {@link Optional#empty()}, if no matching file exists.
     */
    public Optional<FileSystemResource> find(Document document) {
        Path path = buildPath(document);
        if (!Files.exists(path)) {
            return Optional.empty();
        }
        return Optional.of(new FileSystemResource(path));
    }

    /**
     * Deletes a document's file.
     *
     * @param document The document whose file gets deleted.
     * @return Whether the deletion was successful.
     */
    public boolean delete(Document document) {
        try {
            return Files.deleteIfExists(buildPath(document));
        } catch (IOException e) {
            throw new IllegalStateException("failed to delete document file", e);
        }
    }

    /**
     * Builds a path pointing to the file of a specific document.
     *
     * @param document The document to whose file the path will point.
     * @return The path to the document's file.
     */
    private Path buildPath(Document document) {
        return Paths.get(RESOURCE_DIR + document.getId() + document.getExtension());
    }

    /**
     * The path to the {@link #RESOURCE_DIR}.
     *
     * @return the path to the resource directory.
     */
    public String getResourceDir() {
        return RESOURCE_DIR;
    }
}
