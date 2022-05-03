package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.stream.Collectors;

public interface ImageOwner {
    @JsonIgnore
    List<Document> getImages();

    @JsonIgnore
    void setImages(List<Document> images);

    default List<Long> getImageIds() {
        return getImages().stream().map(Document::getId).collect(Collectors.toList());
    }

    default boolean addImage(Document image) {
        return getImages().add(image);
    }
}
