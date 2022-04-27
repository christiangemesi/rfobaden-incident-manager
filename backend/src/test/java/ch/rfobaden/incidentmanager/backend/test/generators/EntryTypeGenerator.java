package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.EntryType;
import ch.rfobaden.incidentmanager.backend.test.generators.base.Generator;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class EntryTypeGenerator extends Generator<EntryType> {

    @Override
    public EntryType generate() {
        EntryType entryType = new EntryType();
        entryType.setType(faker.options().option(EntryType.Type.class));
        entryType.setNumber(faker.phoneNumber().cellPhone());
        return entryType;
    }
}
