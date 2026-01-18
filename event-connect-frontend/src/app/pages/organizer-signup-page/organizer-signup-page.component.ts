import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { ProfileLogin } from '../../shared/models/Profile';

/**
 * Toast Interface
 */
interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

@Component({
  selector: 'app-organizer-signup-page',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './organizer-signup-page.component.html',
  styleUrl: './organizer-signup-page.component.css'
})
export class OrganizerSignupPageComponent {
  isNewOrganizer = true;
  newOrganizerForm: FormGroup;
  existingOrganizerForm: FormGroup;
  
  // Système de toasts
  toasts: Toast[] = [];
  isLoading = false;

  constructor(
    readonly fb: FormBuilder, 
    readonly router: Router, 
    readonly accountService: AccountService
  ) {
    this.newOrganizerForm = this.fb.group({
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      organization: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(?:(?:\+|00)33|0)[1-9](?:\d{8})$/) // Regex téléphone français
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(72),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\dA-Za-z@$!%*?&]{8,72}$/) // Regex complexe
      ]]
    });

    this.existingOrganizerForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', Validators.required]
    });
  }

  switchToNewOrganizer() {
    this.isNewOrganizer = true;
  }

  switchToExistingOrganizer() {
    this.isNewOrganizer = false;
  }

  /**
   * INSCRIPTION - Création d'un nouvel organisateur
   */
  onNewOrganizerSubmit() {
    if (this.newOrganizerForm.invalid) {
      this.addToast('error', 'Veuillez remplir tous les champs correctement ⚠️');
      return;
    }

    this.isLoading = true;
    const formValue = this.newOrganizerForm.value;

    const profile = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      organization: formValue.organization,
      phone: formValue.phone,
      email: formValue.email,
      password: formValue.password,
      roleId: 2 // ROLE_ADMIN pour organisateur
    };

    this.accountService.signup(profile).subscribe({
      next: () => {
        this.addToast('success', '🎉 Inscription réussie ! Connexion en cours...');
        
        // ✅ CORRIGÉ: Extraction pour réduire l'imbrication
        const credentials: ProfileLogin = {
          email: formValue.email,
          password: formValue.password
        };

        setTimeout(() => this.handleAutoLogin(credentials), 1000);
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('❌ Erreur lors de l\'inscription:', error.message);
        this.addToast('error', error.message);
        this.isLoading = false;
      }
    });
  }

  /**
   * ✅ MÉTHODE: Gère la connexion automatique après inscription
   * Extrait pour éviter l'imbrication excessive (>4 niveaux)
   */
  private handleAutoLogin(credentials: ProfileLogin): void {
    this.accountService.login(credentials).subscribe({
      next: (token) => {
        localStorage.setItem('jwt', token);
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('userRole', 'ROLE_ADMIN');
        
        this.router.navigate(['/organizer-dashboard']);
      },
      error: (error: Error) => {
        console.error('❌ Erreur de connexion automatique:', error.message);
        this.addToast('success', 'Inscription réussie ! Veuillez vous connecter 👇');
        
        setTimeout(() => this.switchToExistingOrganizer(), 2000);
      }
    });
  }

  /**
   * CONNEXION - Organisateur existant
   */
  onExistingOrganizerSubmit() {
    if (this.existingOrganizerForm.invalid) {
      this.addToast('error', 'Veuillez remplir tous les champs ⚠️');
      return;
    }

    this.isLoading = true;
    const credentials: ProfileLogin = this.existingOrganizerForm.value;

    this.accountService.login(credentials).subscribe({
      next: (token) => {
        localStorage.setItem('jwt', token);
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('userRole', 'ROLE_ADMIN');

        this.addToast('success', '🎉 Connexion réussie ! Redirection...');
        
        setTimeout(() => {
          this.router.navigate(['/organizer-dashboard']);
        }, 1000);

        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('❌ Erreur de connexion:', error.message);
        this.addToast('error', error.message);
        this.isLoading = false;
      }
    });
  }

  /**
   * Ajouter un toast
   */
  private addToast(type: 'success' | 'error' | 'warning', message: string): void {
    const toast: Toast = {
      id: Date.now(),
      type,
      message
    };
    this.toasts.push(toast);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => this.removeToast(toast.id), 5000);
  }

  /**
   * Supprimer un toast
   */
  removeToast(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }
}