import { Injectable } from '@angular/core';
import { ShareData } from '../../shared/models/ShareData';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }

  /**
   * Partage du contenu via l'API Web Share ou fallback
   */
  async share(data: ShareData): Promise<boolean> {
    // Vérifier si l'API Web Share est disponible
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        // L'utilisateur a annulé le partage
        if ((err as Error).name === 'AbortError') {
          return false;
        }
        // Erreur, utiliser le fallback
        return this.fallbackCopyToClipboard(data.url);
      }
    } else {
      // Navigateur ne supporte pas Web Share API
      return this.fallbackCopyToClipboard(data.url);
    }
  }

  /**
   * Fallback : copier le lien dans le presse-papier
   */
  private async fallbackCopyToClipboard(url: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier ! 📋');
      return true;
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      // Dernier recours : afficher l'URL dans un prompt
      const copied = prompt('Copiez ce lien pour partager:', url);
      return copied !== null;
    }
  }

  /**
   * Vérifie si le partage natif est disponible
   */
  isNativeShareAvailable(): boolean {
    return navigator.share !== undefined;
  }
}
