package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Vehicle;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class VehicleGenerator extends ModelGenerator<Vehicle> {
    public Vehicle generateNew() {
        var vehicle = new Vehicle();
        vehicle.setName(faker.funnyName().name());
        vehicle.setVisible(randomBoolean());
        return vehicle;
    }
}
