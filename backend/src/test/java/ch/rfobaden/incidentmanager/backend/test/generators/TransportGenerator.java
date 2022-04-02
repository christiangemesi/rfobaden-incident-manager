package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class TransportGenerator extends ModelGenerator<Transport> {
    @Autowired
    IncidentGenerator incidentGenerator;

    @Autowired
    UserGenerator userGenerator;

    @Override
    public Transport generateNew() {
        Transport transport = new Transport();
        transport.setIncident(incidentGenerator.generate());
        transport.setTitle(faker.funnyName().name());
        transport.setDescription(doMaybe(() -> faker.lorem().sentence(10)));
        transport.setPeopleInvolved(faker.number().numberBetween(1, 10));
        transport.setDriver(faker.funnyName().name());
        transport.setVehicle(faker.funnyName().name());
        transport.setTrailer(faker.funnyName().name());
        transport.setStartsAt(doMaybe(this::randomDateTime));
        transport.setEndsAt(doMaybe(this::randomDateTime));
        transport.setDestinationPlace(faker.address().buildingNumber());
        transport.setSourcePlace(faker.address().buildingNumber());
        transport.setAssignee(doMaybe(userGenerator::generate));
        return transport;
    }
}
