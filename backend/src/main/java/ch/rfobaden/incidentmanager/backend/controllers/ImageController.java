package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.services.FileLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = "api/v1/file-system")
public class ImageController {

    @Autowired
    private FileLocationService fileLocationService;

    @PostMapping("/image")
    Long uploadImage(@RequestParam MultipartFile image) throws Exception {
        return fileLocationService.save(image.getBytes(), image.getOriginalFilename());
    }

    @GetMapping(value = "/image/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    FileSystemResource downloadImage(@PathVariable Long id) {
        return fileLocationService.find(id);
    }
}
