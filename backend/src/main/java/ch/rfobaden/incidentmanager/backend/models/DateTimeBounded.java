package ch.rfobaden.incidentmanager.backend.models;

import java.time.LocalDateTime;

/**
 * {@code DateTimeBounded} defines a model who is optionally bounded
 * by start and end datetime fields.
 */
public interface DateTimeBounded {
    LocalDateTime getStartsAt();

    void setStartsAt(LocalDateTime startsAt);

    LocalDateTime getEndsAt();

    void setEndsAt(LocalDateTime endsAt);
}
