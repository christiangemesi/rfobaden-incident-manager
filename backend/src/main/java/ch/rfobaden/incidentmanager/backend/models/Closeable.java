package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * {@code Closeable} defines an entity which can be manually closed.
 * A closed entity counts as completed.
 */
public interface Closeable {
    /**
     * Whether the entity is open or closed.
     *
     * @return {@code true} if the entity is open, {@code false} if it's closed.
     */
    @JsonProperty("isClosed")
    boolean isClosed();

    /**
     * Opens or closes the entity.
     *
     * @param closed Whether the entity should be closed or opened.
     */
    @JsonProperty("isClosed")
    void setClosed(boolean closed);
}
