package ch.rfobaden.incidentmanager.backend.models;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import ch.rfobaden.incidentmanager.backend.models.base.PojoTest;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class ImageTest extends PojoTest<Image> {

    @Autowired
    Faker faker;

    @Override
    protected Image generate() {
        return new Image(faker.file().fileName());
    }
}
