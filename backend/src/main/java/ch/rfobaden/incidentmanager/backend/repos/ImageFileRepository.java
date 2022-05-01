package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.repos.base.FileRepository;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Repository
public class ImageFileRepository extends FileRepository {
    public ImageFileRepository() {
        super("files/images/");
    }

    public boolean delete(Long id) {
        Path file = Paths.get(getResourceDir() + id);
        try {
            Files.delete(file);
        } catch (IOException e) {
            return false;
        }
        return true;
    }
}
