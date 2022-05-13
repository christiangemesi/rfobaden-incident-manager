package ch.rfobaden.incidentmanager.backend.models;

import java.util.List;

public interface ImageOwner {
    List<Document> getImages();

    void setImages(List<Document> images);

    default boolean addImage(Document image) {
        return getImages().add(image);
    }
}
