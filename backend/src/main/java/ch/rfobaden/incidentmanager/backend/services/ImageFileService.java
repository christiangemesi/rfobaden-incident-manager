package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.repos.ImageFileRepository;
import ch.rfobaden.incidentmanager.backend.repos.ImageRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class ImageFileService {

    private final ImageFileRepository imageFileRepository;
    private final ImageRepository imageRepository;

    public ImageFileService(
        ImageFileRepository imageFileRepository,
        ImageRepository imageRepository
    ) {
        this.imageFileRepository = imageFileRepository;
        this.imageRepository = imageRepository;
    }

    public Image save(byte[] bytes, String imageName) {
        Image image = imageRepository.save(new Image(imageName));
        imageFileRepository.save(bytes, image.getId());
        return image;
    }

    public Optional<FileSystemResource> find(Long imageId) {
        return imageRepository.findById(imageId).map((image) -> (
            imageFileRepository.findInFileSystem(image.getId())
        ));
    }
}
