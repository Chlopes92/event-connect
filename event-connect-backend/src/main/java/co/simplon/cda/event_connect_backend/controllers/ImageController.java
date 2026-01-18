package co.simplon.cda.event_connect_backend.controllers;

import co.simplon.cda.event_connect_backend.services.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Contrôleur REST pour servir les images uploadées
 *
 * Route publique : GET /upload/images/{filename}
 * Utilisé par le frontend pour afficher les images d'événements
 */
@RestController
@RequestMapping("/upload/images")
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);
    private final FileStorageService fileStorageService;

    public ImageController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * Récupère une image par son nom de fichier
     *
     * @param filename Nom du fichier (ex: "abc123-def456.png")
     * @return ResponseEntity avec l'image et le Content-Type approprié
     */
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Resource resource = new UrlResource(fileStorageService.getImagePath(filename).toUri());

            if (resource.exists()) {
                String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
                MediaType mediaType = switch (extension) {
                    case "png" -> MediaType.IMAGE_PNG;
                    case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
                    default -> MediaType.APPLICATION_OCTET_STREAM;
                };
                return ResponseEntity.ok()
                        .contentType(mediaType)
                        .body(resource);
            }

            logger.warn("Image non trouvée : {}", sanitizeForLogging(filename));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        } catch (IOException e) {
            logger.error("Erreur lors de la lecture du fichier : {}", sanitizeForLogging(filename), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Nettoie le nom de fichier pour éviter les attaques par log injection.
     * Supprime les caractères de contrôle (newline, carriage return, tab).
     */
    private String sanitizeForLogging(String input) {
        if (input == null) {
            return "null";
        }
        return input.replaceAll("[\\r\\n\\t]", " ");
    }
}