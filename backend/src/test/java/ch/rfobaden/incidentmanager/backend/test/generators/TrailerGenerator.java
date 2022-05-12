package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;

public class TrailerGenerator extends ModelGenerator<Trailer> {
    public Trailer generateNew() {
        var trailer = new Trailer();
        trailer.setName(faker.funnyName().name());
        trailer.setVisible(randomBoolean());
        return trailer;
    }
}
