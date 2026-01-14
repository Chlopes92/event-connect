package co.simplon.cda.event_connect_backend.service;

import co.simplon.cda.event_connect_backend.exceptions.InvalidFileException;
import co.simplon.cda.event_connect_backend.services.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires pour FileStorageService
 *
 * Couvre :
 * - Validation des types de fichiers (MIME types)
 * - Validation des extensions
 * - Validation de la taille
 * - Sauvegarde et suppression de fichiers
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)  // ✅ Pour éviter UnnecessaryStubbingException
class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
    }

    // ========== TESTS saveImage() ==========

    @Test
    void saveImage_WithValidPngFile_ShouldSaveFile() {
        MultipartFile mockFile = createMockFile("test.png", "image/png", 1024);
        String filename = fileStorageService.saveImage(mockFile);

        assertThat(filename).isNotNull();
        assertThat(filename).endsWith(".png");
        assertThat(filename).contains("-");
    }

    @Test
    void saveImage_WithValidJpgFile_ShouldSaveFile() {
        MultipartFile mockFile = createMockFile("test.jpg", "image/jpeg", 2048);
        String filename = fileStorageService.saveImage(mockFile);

        assertThat(filename).isNotNull();
        assertThat(filename).endsWith(".jpg");
    }

    @Test
    void saveImage_WithEmptyFile_ShouldReturnNull() {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(true);

        String filename = fileStorageService.saveImage(mockFile);

        assertThat(filename).isNull();
    }

    @Test
    void saveImage_WithNullFile_ShouldReturnNull() {
        String filename = fileStorageService.saveImage(null);
        assertThat(filename).isNull();
    }

    @Test
    void saveImage_WithOversizedFile_ShouldThrowException() {
        long oversized = 6 * 1024 * 1024;
        MultipartFile mockFile = createMockFile("large.png", "image/png", oversized);

        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("volumineux");
    }

    @Test
    void saveImage_WithInvalidMimeType_ShouldThrowException() {
        MultipartFile mockFile = createMockFile("document.pdf", "application/pdf", 1024);

        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Type de fichier non autorisé");
    }

    @Test
    void saveImage_WithInvalidExtension_ShouldThrowException() {
        MultipartFile mockFile = createMockFile("test.txt", "image/png", 1024);

        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Extension non autorisée");
    }

    @Test
    void saveImage_WithNoExtension_ShouldThrowException() {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getSize()).thenReturn(1024L);
        when(mockFile.getContentType()).thenReturn("image/png");
        when(mockFile.getOriginalFilename()).thenReturn("test");

        assertThatThrownBy(() -> fileStorageService.saveImage(mockFile))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("Nom de fichier invalide");
    }

    // ========== TESTS deleteImage() ==========

    @Test
    void deleteImage_WithNonExistentFile_ShouldNotThrowException() {
        fileStorageService.deleteImage("non-existent-file.png");
    }

    @Test
    void deleteImage_WithEmptyFilename_ShouldNotThrowException() {
        fileStorageService.deleteImage("");
        fileStorageService.deleteImage(null);
    }

    // ========== TESTS getImagePath() ==========

    @Test
    void getImagePath_WithValidFilename_ShouldReturnPath() {
        Path result = fileStorageService.getImagePath("test.png");

        assertThat(result).isNotNull();
        assertThat(result.toString()).endsWith("test.png");
    }

    @Test
    void getImagePath_WithEmptyFilename_ShouldThrowException() {
        assertThatThrownBy(() -> fileStorageService.getImagePath(""))
                .isInstanceOf(InvalidFileException.class)
                .hasMessageContaining("invalide");
    }

    @Test
    void getImagePath_WithNullFilename_ShouldThrowException() {
        assertThatThrownBy(() -> fileStorageService.getImagePath(null))
                .isInstanceOf(InvalidFileException.class);
    }

    // ========== MÉTHODES UTILITAIRES ==========

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