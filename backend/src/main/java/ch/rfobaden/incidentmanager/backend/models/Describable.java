package ch.rfobaden.incidentmanager.backend.models;

/**
 * {@code Describable} defines an entity who is described by a title and description field.
 */
public interface Describable {
    /**
     * The entity's title.
     *
     * @return The title.
     */
    String getTitle();

    /**
     * Sets the entity's title.
     *
     * @param title The new title.
     */
    void setTitle(String title);

    /**
     * The entity's description.
     *
     * @return The description.
     */
    String getDescription();

    /**
     * Sets the entity's description.
     *
     * @param description The new description.
     */
    void setDescription(String description);
}
