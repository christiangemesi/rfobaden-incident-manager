package ch.rfobaden.incidentmanager.backend.test.generators;

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
        transport.setAssignee(doMaybe(userGenerator::generate));
        transport.setPriority(faker.options().option(Priority.class));
        transport.setDescription(doMaybe(() -> faker.lorem().sentence(10)));
        transport.setNote(doMaybe(() -> faker.lorem().sentence(10)));
        transport.setLocation(doMaybe(() -> faker.country().capital()));
        transport.setStartsAt(doMaybe(this::randomDateTime));
        transport.setEndsAt(doMaybe(this::randomDateTime));
        transport.setIncident(incidentGenerator.generate());


        return transport;
    }
}
