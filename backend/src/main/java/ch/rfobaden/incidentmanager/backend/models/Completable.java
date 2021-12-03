package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface Completable {
    void setCompletion(CloseReason completion);

    CloseReason getCompletion();

    void setComplete(boolean isComplete);

    @JsonProperty("isComplete")
    boolean isComplete();
}
