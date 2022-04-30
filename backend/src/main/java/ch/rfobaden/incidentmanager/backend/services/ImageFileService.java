package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.repos.FileRepository;
import ch.rfobaden.incidentmanager.backend.repos.ImageRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImageFileService {

    private final FileRepository fileRepository;
    private final ImageRepository imageRepository;

    public ImageFileService(
        FileRepository fileRepository,
        ImageRepository imageRepository
    ) {
        this.fileRepository = fileRepository;
        this.imageRepository = imageRepository;
    }

    public Image save(byte[] bytes, String imageName) {
        Image image = imageRepository.save(new Image(imageName));
        fileRepository.save(bytes, image.getId());
        return image;
    }

    public Optional<FileSystemResource> find(Long imageId) {
        return imageRepository.findById(imageId).map((image) -> (
            fileRepository.findInFileSystem(image.getId())
        ));
    }
}
