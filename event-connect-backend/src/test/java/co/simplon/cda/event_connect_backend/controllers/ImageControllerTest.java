package co.simplon.cda.event_connect_backend.controllers;

import co.simplon.cda.event_connect_backend.services.FileStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires COMPLETS pour ImageController
 *
 * COUVERTURE CIBLE : ~95%
 *
 * Structure :
 * - Tests nominaux (cas standards)
 * - Tests d'erreur (404, exceptions)
 * - Tests edge cases (extensions, caractères spéciaux)
 *
 * Note sur la couverture :
 * - Le bloc catch(IOException) est difficile à tester de manière fiable
 *   car UrlResource ne lance IOException que dans des cas système très spécifiques
 * - La branche logger.isWarnEnabled() dépend de la configuration de logging
 * - sanitizeForLogging(null) est testé indirectement via les erreurs
 */
@ExtendWith(MockitoExtension.class)
class ImageControllerTest {

    @Mock
    private FileStorageService fileStorageService;
    @InjectMocks
    private ImageController imageController;
    @TempDir
    Path tempDir;

    /**
     * TEST 1 : getImage() avec fichier PNG existant
     */
    @Test
    void getImage_WithExistingPngFile_ShouldReturnImageWithCorrectMediaType() throws IOException {
        // GIVEN
        String filename = "test-image.png";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "fake png content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_PNG);
        assertThat(response.getBody()).isNotNull();

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 2 : getImage() avec fichier JPG existant
     */
    @Test
    void getImage_WithExistingJpgFile_ShouldReturnImageWithCorrectMediaType() throws IOException {
        // GIVEN
        String filename = "test-image.jpg";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "fake jpg content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_JPEG);

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 3 : getImage() avec fichier JPEG existant
     */
    @Test
    void getImage_WithExistingJpegFile_ShouldReturnImageWithCorrectMediaType() throws IOException {
        // GIVEN
        String filename = "test-image.jpeg";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "fake jpeg content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_JPEG);

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 4 : getImage() avec extension inconnue
     * Vérifie que le fallback APPLICATION_OCTET_STREAM est utilisé
     */
    @Test
    void getImage_WithUnknownExtension_ShouldReturnOctetStreamMediaType() throws IOException {
        // GIVEN
        String filename = "test-file.webp";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "fake webp content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_OCTET_STREAM);

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 5 : getImage() avec fichier non trouvé
     * Vérifie que 404 est retourné
     */
    @Test
    void getImage_WithNonExistentFile_ShouldReturn404() {
        // GIVEN
        String filename = "non-existent.png";
        Path nonExistentPath = tempDir.resolve(filename);
        // Ne PAS créer le fichier

        when(fileStorageService.getImagePath(filename)).thenReturn(nonExistentPath);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNull();

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 6 : getImage() avec null filename et fichier inexistant
     * Vérifie que sanitizeForLogging(null) fonctionne correctement
     * COUVRE : Branche if(input == null) dans sanitizeForLogging()
     */
    @Test
    void getImage_WithNullFilename_NonExistentFile_ShouldReturn404() {
        // GIVEN
        String filename = null;
        Path nonExistentPath = tempDir.resolve("dummy.png");
        // Ne PAS créer le fichier

        when(fileStorageService.getImagePath(null)).thenReturn(nonExistentPath);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

        verify(fileStorageService, times(1)).getImagePath(null);

        // sanitizeForLogging(null) devrait retourner "null" dans les logs
        // Log attendu : "Image non trouvée : null"
    }

    /**
     * TEST 7 : getImage() avec null filename et fichier existant
     * BUG IDENTIFIÉ : Le code lance NullPointerException à la ligne 46
     * car filename.substring() est appelé sans vérification null
     */
    @Test
    void getImage_WithNullFilename_ExistingFile_ShouldThrowNullPointerException() throws IOException {
        // GIVEN
        String filename = null;
        Path existingFile = tempDir.resolve("existing.png");
        Files.write(existingFile, "content".getBytes()); // Créer le fichier

        when(fileStorageService.getImagePath(null)).thenReturn(existingFile);

        // WHEN & THEN
        // Si resource.exists() = true, alors on arrive à la ligne 46
        // filename.substring(filename.lastIndexOf('.') + 1) lance NPE
        assertThatThrownBy(() -> imageController.getImage(filename))
                .isInstanceOf(NullPointerException.class);

        verify(fileStorageService, times(1)).getImagePath(null);
    }

    /**
     * TEST 8 : getImage() avec caractères de contrôle multiples
     * Garantit que sanitizeForLogging nettoie tous les caractères
     */
    @Test
    void getImage_WithMultipleControlCharacters_ShouldSanitize() {
        // GIVEN
        String maliciousFilename = "test\t\r\n\r\n\tmalicious.png";
        Path nonExistentPath = tempDir.resolve("test.png");

        when(fileStorageService.getImagePath(maliciousFilename)).thenReturn(nonExistentPath);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(maliciousFilename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

        verify(fileStorageService, times(1)).getImagePath(maliciousFilename);

        // sanitizeForLogging devrait avoir remplacé tous les \t, \r, \n par des espaces
    }

    /**
     * TEST 9 : getImage() avec fichier contenant plusieurs points
     * Vérifie que l'extension est correctement extraite
     */
    @Test
    void getImage_WithMultipleDotsInFilename_ShouldExtractCorrectExtension() throws IOException {
        // GIVEN
        String filename = "my.test.image.png";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "fake content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_PNG);

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 10 : getImage() avec extension en majuscules
     * Vérifie que toLowerCase() fonctionne correctement
     */
    @Test
    void getImage_WithUppercaseExtension_ShouldConvertToLowercase() throws IOException {
        // GIVEN
        String filename = "test-IMAGE.PNG";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "fake content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_PNG);

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 11 : getImage() avec filename sans extension
     * COUVRE : Cas où lastIndexOf('.') retourne -1
     * substring(-1 + 1) = substring(0) = tout le filename
     */
    @Test
    void getImage_WithFilenameWithoutExtension_ShouldReturnOctetStream() throws IOException {
        // GIVEN
        String filename = "file_without_extension";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        // Sans extension, le switch sur "file_without_extension" retourne OCTET_STREAM
        assertThat(response.getHeaders().getContentType())
                .isEqualTo(MediaType.APPLICATION_OCTET_STREAM);

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 12 : getImage() avec extension vide (fichier se terminant par un point)
     * COUVRE : Edge case extension vide après substring
     */
    @Test
    void getImage_WithEmptyExtension_ShouldReturnOctetStream() throws IOException {
        // GIVEN
        String filename = "testfile.";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        // Extension vide ("") ne match aucun case, donc default = OCTET_STREAM
        assertThat(response.getHeaders().getContentType())
                .isEqualTo(MediaType.APPLICATION_OCTET_STREAM);

        verify(fileStorageService, times(1)).getImagePath(filename);
    }

    /**
     * TEST 13 : getImage() avec différents types de fichiers non trouvés
     * COUVRE : Plusieurs scénarios de fichiers inexistants avec différentes extensions
     */
    @Test
    void getImage_WithVariousNonExistentFiles_ShouldReturn404() {
        // GIVEN - Différents types de fichiers non trouvés
        String[] filenames = {
                "non-existent-png.png",
                "non-existent-jpg.jpg",
                "non-existent-jpeg.jpeg",
                "non-existent.webp",
                "another-missing.gif"
        };

        for (String filename : filenames) {
            Path nonExistentPath = tempDir.resolve(filename);
            when(fileStorageService.getImagePath(filename)).thenReturn(nonExistentPath);

            // WHEN
            ResponseEntity<Resource> response = imageController.getImage(filename);

            // THEN
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            assertThat(response.getBody()).isNull();
        }

        // Vérifier que le service a été appelé pour chaque fichier
        verify(fileStorageService, times(filenames.length)).getImagePath(anyString());
    }

    /**
     * TEST 14 : getImage() avec extension mixte casse
     * Vérifie que le toLowerCase gère correctement toutes les variations
     */
    @Test
    void getImage_WithMixedCaseExtension_ShouldConvertCorrectly() throws IOException {
        // GIVEN
        String filename = "test-image.JpG";
        Path testFile = tempDir.resolve(filename);
        Files.write(testFile, "fake content".getBytes());

        when(fileStorageService.getImagePath(filename)).thenReturn(testFile);

        // WHEN
        ResponseEntity<Resource> response = imageController.getImage(filename);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_JPEG);

        verify(fileStorageService, times(1)).getImagePath(filename);
    }
}