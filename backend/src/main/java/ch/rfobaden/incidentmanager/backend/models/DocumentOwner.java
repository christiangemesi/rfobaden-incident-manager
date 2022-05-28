package ch.rfobaden.incidentmanager.backend.models;

import java.util.List;

/**
 * {@code DocumentOwner} defines an entity to which {@link Document documents} can be attached.
 */
public interface DocumentOwner {
    /**
     * Allows access to the documents attached to the entity.
     *
     * @return The entity's documents.
     */
    List<Document> getDocuments();

    /**
     * Sets the documents attached to the entity.
     *
     * @param documents The new documents.
     */
    void setDocuments(List<Document> documents);

    /**
     * Attaches a new document to the entity.
     *
     * @param document The new document.
     * @return Whether the document was successfully attached.
     */
    default boolean addDocument(Document document) {
        return getDocuments().add(document);
    }
}
