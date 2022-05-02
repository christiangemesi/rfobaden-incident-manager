package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.repos.base.FileRepositoryTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DocumentFileRepositoryTest extends FileRepositoryTest {

    public static final String PATH_TO_TEST_FILE = "src/test/resources/testImage/blank.pdf";

    @Autowired
    public DocumentFileRepositoryTest(DocumentFileRepository documentFileRepository) {
        super(documentFileRepository, PATH_TO_TEST_FILE);
    }
}
