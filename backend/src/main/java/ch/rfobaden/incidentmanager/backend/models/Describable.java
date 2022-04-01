package ch.rfobaden.incidentmanager.backend.models;

/**
 * {@code Describable} defines a model who is described by a title and description field.
 */
public interface Describable {
    String getTitle();

    void setTitle(String title);

    String getDescription();

    void setDescription(String description);
}
