package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.stream.Collectors;

public interface ImageOwner {
    @JsonIgnore
    List<Image> getImages();

    @JsonIgnore
    void setImages(List<Image> images);

    default List<Long> getImageIds() {
        return getImages().stream().map(Image::getId).collect(Collectors.toList());
    }

    default boolean addImage(Image image) {
        return getImages().add(image);
    }

    default boolean deleteImageById(Long imageId) {
        return getImages().removeIf(img -> img.getId().equals(imageId));
    }
}
