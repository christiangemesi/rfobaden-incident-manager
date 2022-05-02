package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.repos.base.FileRepository;
import org.springframework.stereotype.Repository;

@Repository
public class DocumentFileRepository extends FileRepository {

    public DocumentFileRepository() {
        super("files/documents/");
    }
}
