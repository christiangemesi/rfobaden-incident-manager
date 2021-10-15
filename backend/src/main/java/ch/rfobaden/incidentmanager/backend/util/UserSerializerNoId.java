package ch.rfobaden.incidentmanager.backend.util;

import ch.rfobaden.incidentmanager.backend.user.User;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class UserSerializerNoId extends StdSerializer<User> {

    public UserSerializerNoId() {
        this(null);
    }

    public UserSerializerNoId(Class<User> t) {
        super(t);
    }

    @Override
    public void serialize(User value, JsonGenerator gen, SerializerProvider provider)
            throws IOException {
        gen.writeStartObject();
        gen.writeStringField("username", value.getUsername());
        gen.writeStringField("password", value.getPassword());
        gen.writeEndObject();
    }
}
