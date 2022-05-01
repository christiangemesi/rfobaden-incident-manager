package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.repos.base.FileRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ImageFileRepository extends FileRepository {

    public ImageFileRepository() {
        super("files/images/");
    }

    public boolean delete(Long id) {
        Path file = Paths.get(RESOURCES_DIR + id + ".jpeg");
        try {
            Files.delete(file);
        } catch (IOException e) {
            return false;
        }
        return true;
    }
}
