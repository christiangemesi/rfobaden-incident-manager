package ch.rfobaden.incidentmanager.backend.models;

public interface Completable {
    void close(String reason);

    void reopen();
}
