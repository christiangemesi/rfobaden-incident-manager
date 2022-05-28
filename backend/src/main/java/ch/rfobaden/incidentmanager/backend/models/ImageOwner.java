package ch.rfobaden.incidentmanager.backend.models;

import java.util.List;

/**
 * {@code ImageOwner} defines an entity to which {@link Document image documents} can be attached.
 */
public interface ImageOwner {
    /**
     * Allows access to the images attached to the entity.
     *
     * @return The entity's images.
     */
    List<Document> getImages();

    /**
     * Sets the images attached to the entity.
     *
     * @param images The new images.
     */
    void setImages(List<Document> images);

    /**
     * Attaches a new image to the entity.
     *
     * @param image The new image.
     * @return Whether the image was successfully attached.
     */
    default boolean addImage(Document image) {
        return getImages().add(image);
    }
}
