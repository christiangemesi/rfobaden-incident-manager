package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.stream.Collectors;

public interface DocumentOwner {

    @JsonIgnore
    List<Document> getDocuments();

    @JsonIgnore
    void setDocuments(List<Document> documents);

    default List<Long> getDocumentIds() {
        return getDocuments().stream().map(Document::getId).collect(Collectors.toList());
    }

    default boolean addDocument(Document document) {
        return getDocuments().add(document);
    }


}
