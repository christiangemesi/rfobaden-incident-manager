package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Image;
import ch.rfobaden.incidentmanager.backend.repos.FileSystemRepository;
import ch.rfobaden.incidentmanager.backend.repos.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileLocationService {

    @Autowired
    private FileSystemRepository fileSystemRepository;
    @Autowired
    private ImageRepository imageRepository;

    public Long save(byte[] bytes, String imageName) {
        String location = fileSystemRepository.save(bytes, imageName);

        return imageRepository.save(new Image(location, imageName)).getId();
    }

    public FileSystemResource find(Long imageId) {
        Image image = imageRepository.findById(imageId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return fileSystemRepository.findInFileSystem(image.getLocation());
    }
}
