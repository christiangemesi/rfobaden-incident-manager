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
        gen.writeNumberField("Id", value.getId());
        gen.writeStringField("title", value.getTitle());
        gen.writeNumberField("author", value.getAuthorId());
        gen.writeStringField("description", value.getDescription());
        gen.writeStringField("closeReason", value.getCloseReason());
        gen.writeBooleanField("isClosed", value.isClosed());
        //todo is it fine to wrap Date to string?
        gen.writeStringField("creationDate", String.valueOf(value.getCreationDate()));
        gen.writeStringField("updateDate", String.valueOf(value.getCreationDate()));
        gen.writeStringField("startDate", String.valueOf(value.getCreationDate()));
        gen.writeStringField("endDate", String.valueOf(value.getCreationDate()));

        gen.writeEndObject();
    }

}
