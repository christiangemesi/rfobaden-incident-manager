package ch.rfobaden.incidentmanager.backend.models;

import java.util.List;

public interface DocumentOwner {

    List<Document> getDocuments();

    void setDocuments(List<Document> documents);

    default boolean addDocument(Document document) {
        return getDocuments().add(document);
    }
}
