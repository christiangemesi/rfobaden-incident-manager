package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.base.PojoTest;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;

class ImageTest extends PojoTest<Image> {

    @Autowired
    Faker faker;

    @Override
    protected Image generate() {
        return new Image(faker.file().fileName());
    }
}
