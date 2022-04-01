package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.repos.FileSystemRepository;
import ch.rfobaden.incidentmanager.backend.repos.ImageRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileLocationService {

    private final FileSystemRepository fileSystemRepository;
    private final ImageRepository imageRepository;

    public FileLocationService(
        FileSystemRepository fileSystemRepository,
        ImageRepository imageRepository
    ) {
        this.fileSystemRepository = fileSystemRepository;
        this.imageRepository = imageRepository;
    }

    public Image save(byte[] bytes, String imageName) {
        String imageLocation = fileSystemRepository.save(bytes, imageName);
        Image image = new Image(imageName);
        image.setLocation(imageLocation);
        imageRepository.save(image);
        return image;
    }

    public FileSystemResource find(Long imageId) {
        Image image = imageRepository.findById(imageId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return fileSystemRepository.findInFileSystem(image.getLocation());
    }
}
