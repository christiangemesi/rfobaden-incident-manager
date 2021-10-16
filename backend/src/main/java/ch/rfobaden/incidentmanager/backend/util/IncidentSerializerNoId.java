package ch.rfobaden.incidentmanager.backend.util;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class IncidentSerializerNoId extends StdSerializer<Incident> {
    public IncidentSerializerNoId() {
        this(null);
    }

    public IncidentSerializerNoId(Class<Incident> t) {
        super(t);
    }

    @Override
    public void serialize(Incident value, JsonGenerator gen, SerializerProvider provider)
            throws IOException {
        gen.writeStartObject();
        //todo should all variables be serialized?
        gen.writeStringField("title", value.getTitle());
        gen.writeEndObject();
    }

}
