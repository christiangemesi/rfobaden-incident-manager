package ch.rfobaden.incidentmanager.backend.repos;


import ch.rfobaden.incidentmanager.backend.repos.base.FileRepositoryTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ImageFileRepositoryTest extends FileRepositoryTest {

    public static final String PATH_TO_TEST_FILE = "src/test/resources/files/fish.jpeg";

    @Autowired
    public ImageFileRepositoryTest(ImageFileRepository imageFileRepository) {
        super(imageFileRepository, PATH_TO_TEST_FILE);
    }
}
