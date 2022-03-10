package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.Organization;
import ch.rfobaden.incidentmanager.backend.models.Priority;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import org.springframework.beans.factory.annotation.Autowired;

public class TransportGenerator extends ModelGenerator<Transport> {

    @Autowired
    UserGenerator userGenerator;

    @Autowired
    IncidentGenerator incidentGenerator;

    @Override
    public Transport generateNew() {
        Transport transport = new Transport();
        transport.setTitle(faker.funnyName().name());
        transport.setIncident(incidentGenerator.generate());
        transport.setPeopleInvolved(faker.number().numberBetween(1, 10));
        transport.setDescription(doMaybe(() -> faker.lorem().sentence(10)));
        transport.setTrailer(faker.funnyName().name());
        transport.setStartsAt(doMaybe(this::randomDateTime));
        transport.setEndsAt(doMaybe(this::randomDateTime));
        transport.setVehicle(faker.funnyName().name());
        transport.setDestinationPlace(faker.address().buildingNumber());
        transport.setSourcePlace(faker.address().buildingNumber());
        transport.setAssignee(doMaybe(userGenerator::generate));

        return transport;
    }
}
