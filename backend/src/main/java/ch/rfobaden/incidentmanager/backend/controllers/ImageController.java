package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.services.FileLocationService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(path = "api/v1/file-system")
public class ImageController {
    private final FileLocationService fileLocationService;

    public ImageController(FileLocationService fileLocationService) {
        this.fileLocationService = fileLocationService;
    }

    @PostMapping("/image")
    Long uploadImage(@RequestParam MultipartFile image) {
        try {
            return fileLocationService.save(image.getBytes(), image.getOriginalFilename()).getId();
        } catch (IOException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Image upload failed");
        }
    }

    @GetMapping(value = "/image/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    FileSystemResource downloadImage(@PathVariable Long id) {
        return fileLocationService.find(id);
    }
}
