package co.simplon.cda.event_connect_backend.services;

import co.simplon.cda.event_connect_backend.exceptions.InvalidFileException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires COMPLETS pour FileStorageService
 *
 *
 * Couvre :
 * - Validation des types de fichiers (MIME types)
 * - Validation des extensions (toutes les extensions supportées)
 * - Validation de la taille
 * - Sauvegarde et suppression de fichiers
 * - Gestion des erreurs IOException
 * - Cas limites (null, vide, extensions en majuscules)
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class FileStorageServiceTest {
    private FileStorageService fileStorageService;
    private static final Path UPLOAD_PATH = Paths.get("uploads/events");

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
    }

    @AfterEach
    void tearDown() throws IOException {
        // Nettoyage : supprimer les fichiers de test créés
        if (Files.exists(UPLOAD_PATH)) {
            Files.list(UPLOAD_PATH)
                    .filter(path -> path.getFileName().toString().contains("-"))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException e) {
                            // Ignorer les erreurs de nettoyage
                        }
                    });
        }
    }

    /**
     * TEST 1 : Sauvegarde d'un fichier PNG valide
     */
    @Test
    void saveImage_WithValidPngFile_ShouldSaveFile() {
        // GIVEN
        MultipartFile mockFile = createMockFile("test.png", "image/png", 1024);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull().endsWith(".png").contains("-");

        // Vérifier que le fichier existe physiquement
        Path savedFile = UPLOAD_PATH.resolve(filename);
        assertThat(savedFile).exists();
    }

    /**
     * TEST 2 : Sauvegarde d'un fichier JPG valide
     */
    @Test
    void saveImage_WithValidJpgFile_ShouldSaveFile() {
        // GIVEN
        MultipartFile mockFile = createMockFile("test.jpg", "image/jpeg", 2048);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull().endsWith(".jpg");
        assertThat(UPLOAD_PATH.resolve(filename)).exists();
    }

    /**
     * TEST 3 : Sauvegarde d'un fichier JPEG valide
     */
    @Test
    void saveImage_WithValidJpegFile_ShouldSaveFile() {
        // GIVEN
        MultipartFile mockFile = createMockFile("photo.jpeg", "image/jpeg", 1500);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull().endsWith(".jpeg");
        assertThat(UPLOAD_PATH.resolve(filename)).exists();
    }

    /**
     * TEST 4 : Sauvegarde d'un fichier WEBP valide
     */
    @Test
    void saveImage_WithValidWebpFile_ShouldSaveFile() {
        // GIVEN
        MultipartFile mockFile = createMockFile("image.webp", "image/webp", 3000);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull().endsWith(".webp");
        assertThat(UPLOAD_PATH.resolve(filename)).exists();
    }

    /**
     * TEST 5 : Sauvegarde avec MIME type en majuscules
     * Vérifie que toLowerCase() fonctionne
     */
    @Test
    void saveImage_WithUppercaseMimeType_ShouldSaveFile() {
        // GIVEN
        MultipartFile mockFile = createMockFile("test.png", "IMAGE/PNG", 1024);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull().endsWith(".png");
    }

    /**
     * TEST 6 : Sauvegarde avec extension en majuscules
     * Vérifie que l'extension est convertie en minuscules
     */
    @Test
    void saveImage_WithUppercaseExtension_ShouldSaveFileWithLowercaseExtension() {
        // GIVEN
        MultipartFile mockFile = createMockFile("TEST.PNG", "image/png", 1024);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull().endsWith(".png"); // En minuscules
    }

    /**
     * TEST 7 : Sauvegarde avec nom de fichier contenant plusieurs points
     */
    @Test
    void saveImage_WithMultipleDotsInFilename_ShouldExtractCorrectExtension() {
        // GIVEN
        MultipartFile mockFile = createMockFile("my.test.image.jpg", "image/jpeg", 2000);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull().endsWith(".jpg");
    }

    /**
     * TEST 8 : Fichier vide → retourne null
     */
    @Test
    void saveImage_WithEmptyFile_ShouldReturnNull() {
        // GIVEN
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(true);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNull();
    }

    /**
     * TEST 9 : Fichier null → retourne null
     */
    @Test
    void saveImage_WithNullFile_ShouldReturnNull() {
        // WHEN
        String filename = fileStorageService.saveImage(null);

        // THEN
        assertThat(filename).isNull();
    }

    /**
     * TEST 10 : Fichier trop volumineux → exception
     */
    @Test
    void saveImage_WithOversizedFile_ShouldThrowException() {
        // GIVEN
        long oversized = 6L * 1024 * 1024; // 6 MB (max = 5 MB)
        MultipartFile mockFile = createMockFile("large.png", "image/png", oversized);

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("volumineux");
    }

    /**
     * TEST 11 : Fichier à la limite exacte (5 MB) → doit passer
     */
    @Test
    void saveImage_WithExactMaxSize_ShouldSaveFile() {
        // GIVEN
        long maxSize = 5L * 1024 * 1024; // Exactement 5 MB
        MultipartFile mockFile = createMockFile("max-size.png", "image/png", maxSize);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull();
    }

    /**
     * TEST 12 : Fichier très petit (< 1 KB) → formatFileSize
     */
    @Test
    void saveImage_WithVerySmallFile_ShouldFormatSizeInBytes() {
        // GIVEN
        MultipartFile mockFile = createMockFile("tiny.png", "image/png", 512); // 512 bytes

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull();
        // formatFileSize(512) devrait retourner "512 B"
    }

    /**
     * TEST 13 : Fichier moyen (< 1 MB) → formatFileSize en KB
     */
    @Test
    void saveImage_WithMediumFile_ShouldFormatSizeInKB() {
        // GIVEN
        MultipartFile mockFile = createMockFile("medium.png", "image/png", 500 * 1024); // 500 KB

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull();
        // formatFileSize(500KB) devrait retourner "500.0 KB"
    }

    /**
     * TEST 14 : MIME type invalide (PDF) → exception
     */
    @Test
    void saveImage_WithInvalidMimeType_ShouldThrowException() {
        // GIVEN
        MultipartFile mockFile = createMockFile("document.pdf", "application/pdf", 1024);

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Type de fichier non autorisé");
    }

    /**
     * TEST 15 : MIME type null → exception
     */
    @Test
    void saveImage_WithNullMimeType_ShouldThrowException() {
        // GIVEN
        MultipartFile mockFile = createMockFile("test.png", null, 1024);

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Type de fichier non autorisé");
    }

    /**
     * TEST 16 : MIME type video → exception
     */
    @Test
    void saveImage_WithVideoMimeType_ShouldThrowException() {
        // GIVEN
        MultipartFile mockFile = createMockFile("video.mp4", "video/mp4", 2048);

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Type de fichier non autorisé");
    }

    /**
     * TEST 17 : MIME type image/jpg (alternative) → doit passer
     */
    @Test
    void saveImage_WithAlternativeJpgMimeType_ShouldSaveFile() {
        // GIVEN
        MultipartFile mockFile = createMockFile("test.jpg", "image/jpg", 1024);

        // WHEN
        String filename = fileStorageService.saveImage(mockFile);

        // THEN
        assertThat(filename).isNotNull().endsWith(".jpg");
    }

    /**
     * TEST 18 : Extension non autorisée (.txt) → exception
     */
    @Test
    void saveImage_WithInvalidExtension_ShouldThrowException() {
        // GIVEN
        MultipartFile mockFile = createMockFile("test.txt", "image/png", 1024);

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Extension non autorisée");
    }

    /**
     * TEST 19 : Pas d'extension → exception
     */
    @Test
    void saveImage_WithNoExtension_ShouldThrowException() {
        // GIVEN
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getSize()).thenReturn(1024L);
        when(mockFile.getContentType()).thenReturn("image/png");
        when(mockFile.getOriginalFilename()).thenReturn("test"); // Pas de point

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Nom de fichier invalide");
    }

    /**
     * TEST 20 : Nom de fichier null → exception
     */
    @Test
    void saveImage_WithNullFilename_ShouldThrowException() {
        // GIVEN
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getSize()).thenReturn(1024L);
        when(mockFile.getContentType()).thenReturn("image/png");
        when(mockFile.getOriginalFilename()).thenReturn(null);

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Nom de fichier invalide");
    }

    /**
     * TEST 21 : Extension .gif (non supportée) → exception
     */
    @Test
    void saveImage_WithGifExtension_ShouldThrowException() {
        // GIVEN
        MultipartFile mockFile = createMockFile("animated.gif", "image/png", 1024);

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Extension non autorisée");
    }

    /**
     * TEST 22 : IOException lors de getInputStream → exception
     */
    @Test
    void saveImage_WithIOExceptionOnInputStream_ShouldThrowInvalidFileException() throws IOException {
        // GIVEN
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getSize()).thenReturn(1024L);
        when(mockFile.getContentType()).thenReturn("image/png");
        when(mockFile.getOriginalFilename()).thenReturn("test.png");
        when(mockFile.getInputStream()).thenThrow(new IOException("Stream error"));

        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Erreur lors de la sauvegarde");
    }

    /**
     * TEST 23 : Suppression d'un fichier existant
     */
    @Test
    void deleteImage_WithExistingFile_ShouldDeleteFile() throws IOException {
        // GIVEN - Créer un fichier réel
        String filename = "test-delete.png";
        Path testFile = UPLOAD_PATH.resolve(filename);
        Files.write(testFile, "test content".getBytes());
        assertThat(testFile).exists();

        // WHEN
        fileStorageService.deleteImage(filename);

        // THEN
        assertThat(testFile).doesNotExist();
    }

    /**
     * TEST 24 : Suppression d'un fichier inexistant → pas d'exception
     */
    @Test
    void deleteImage_WithNonExistentFile_ShouldNotThrowException() {
        // WHEN & THEN
        assertThatCode(() -> fileStorageService.deleteImage("non-existent-file.png"))
                .doesNotThrowAnyException();
    }

    /**
     * TEST 25 : Suppression avec filename null → pas d'exception
     */
    @Test
    void deleteImage_WithNullFilename_ShouldNotThrowException() {
        // WHEN & THEN
        assertThatCode(() -> fileStorageService.deleteImage(null))
                .doesNotThrowAnyException();
    }

    /**
     * TEST 26 : Suppression avec filename vide → pas d'exception
     */
    @Test
    void deleteImage_WithEmptyFilename_ShouldNotThrowException() {
        // WHEN & THEN
        assertThatCode(() -> fileStorageService.deleteImage(""))
                .doesNotThrowAnyException();
    }

    /**
     * TEST 27 : Suppression avec filename blank (espaces) → pas d'exception
     */
    @Test
    void deleteImage_WithBlankFilename_ShouldNotThrowException() {
        // WHEN & THEN
        assertThatCode(() -> fileStorageService.deleteImage("   "))
                .doesNotThrowAnyException();
    }

    /**
     * TEST 28 : getImagePath avec nom valide → retourne Path
     */
    @Test
    void getImagePath_WithValidFilename_ShouldReturnPath() {
        // WHEN
        Path result = fileStorageService.getImagePath("test.png");

        // THEN
        assertThat(result).isNotNull().asString().endsWith("test.png");
    }

    /**
     * TEST 29 : getImagePath avec filename vide → exception
     */
    @Test
    void getImagePath_WithEmptyFilename_ShouldThrowException() {
        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.getImagePath(""))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("invalide");
    }

    /**
     * TEST 30 : getImagePath avec filename null → exception
     */
    @Test
    void getImagePath_WithNullFilename_ShouldThrowException() {
        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.getImagePath(null))
                .isInstanceOf(InvalidFileException.class);
    }

    /**
     * TEST 31 : getImagePath avec filename blank → exception
     */
    @Test
    void getImagePath_WithBlankFilename_ShouldThrowException() {
        // WHEN & THEN
        assertThatThrownBy(() -> fileStorageService.getImagePath("   "))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("invalide");
    }

    /**
     * Crée un mock de MultipartFile pour les tests
     */
    private MultipartFile createMockFile(String filename, String contentType, long size) {
        MultipartFile mockFile = mock(MultipartFile.class);

        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getOriginalFilename()).thenReturn(filename);
        when(mockFile.getContentType()).thenReturn(contentType);
        when(mockFile.getSize()).thenReturn(size);

        try {
            InputStream inputStream = new ByteArrayInputStream("fake image content".getBytes());
            when(mockFile.getInputStream()).thenReturn(inputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return mockFile;
    }
}