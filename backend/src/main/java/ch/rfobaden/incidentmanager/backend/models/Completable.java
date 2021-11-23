package ch.rfobaden.incidentmanager.backend.models;

public interface Completable {
    void setCompletion(Completion completion);

    Completion getCompletion();

    void setComplete(boolean isComplete);

    boolean isComplete();
}
