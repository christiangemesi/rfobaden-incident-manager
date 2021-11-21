package ch.rfobaden.incidentmanager.backend.models;

public interface Completable {
    void setCompletion(String reason);

    Completion getCompletion();

    void setComplete(boolean state);

    boolean isComplete();
}
