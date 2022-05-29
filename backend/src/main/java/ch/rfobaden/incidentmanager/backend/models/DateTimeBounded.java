package ch.rfobaden.incidentmanager.backend.models;

import java.time.LocalDateTime;

/**
 * {@code DateTimeBounded} defines an entity who is optionally bounded
 * by start and end datetime fields.
 */
public interface DateTimeBounded {
    /**
     * Allows access to the point of time at which the entity starts in local time.
     * Can be `null` if the entity does not have a fixed start.
     *
     * @return The entity's start date.
     */
    LocalDateTime getStartsAt();

    /**
     * Sets the point of time at which the entity starts.
     *
     * @param startsAt The entity's new start date.
     */
    void setStartsAt(LocalDateTime startsAt);

    /**
     * Allows access to the point of time at which the entity ends in local time.
     * Can be `null` if the entity does not have a fixed end.
     *
     * @return The entity's end date.
     */
    LocalDateTime getEndsAt();

    /**
     * Sets the point of time at which the entity ends.
     *
     * @param endsAt The entity's new end date.
     */
    void setEndsAt(LocalDateTime endsAt);
}
