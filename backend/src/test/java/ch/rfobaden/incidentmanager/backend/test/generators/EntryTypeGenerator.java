package ch.rfobaden.incidentmanager.backend.test.generators;

import ch.rfobaden.incidentmanager.backend.models.EntryType;
import ch.rfobaden.incidentmanager.backend.test.generators.base.Generator;
import org.springframework.boot.test.context.TestComponent;

@TestComponent
public class EntryTypeGenerator extends Generator<EntryType> {

    @Override
    public EntryType generate() {
        EntryType entryType = new EntryType();
        entryType.setSource(faker.options().option(EntryType.Source.class));
        entryType.setDescriptor(faker.phoneNumber().cellPhone());
        return entryType;
    }
}
