package co.simplon.cda.event_connect_backend.controllers;

import co.simplon.cda.event_connect_backend.services.FileStorageService;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/upload/images")
public class ImageController {

    private final FileStorageService fileStorageService;

    public ImageController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/{filename}")
    public ResponseEntity<?> getImage(@PathVariable String filename) {
        try {
            var resource = new UrlResource(fileStorageService.getImagePath(filename).toUri());
            if(resource.exists()) {
                String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
                MediaType mediaType =switch (extension) {
                    case "png" -> MediaType.IMAGE_PNG;
                    case "jpg" -> MediaType.IMAGE_JPEG;
                    default -> MediaType.APPLICATION_OCTET_STREAM;
                };
                return ResponseEntity.ok()
                        .contentType(mediaType)
                        .body(resource);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
