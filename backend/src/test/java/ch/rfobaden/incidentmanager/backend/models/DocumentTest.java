package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.base.PojoTest;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;

public class DocumentTest extends PojoTest<Document> {

    @Autowired
    Faker faker;

    @Override
    protected Document generate() {
        return new Document(faker.file().fileName());
    }
}
