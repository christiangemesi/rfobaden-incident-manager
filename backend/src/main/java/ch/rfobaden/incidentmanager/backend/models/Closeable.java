package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * {@code Closeable} defines a model which can be manually closed.
 */
public interface Closeable {
    @JsonProperty("isClosed")
    boolean isClosed();

    @JsonProperty("isClosed")
    void setClosed(boolean closed);
}
