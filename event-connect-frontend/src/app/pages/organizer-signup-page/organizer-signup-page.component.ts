import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { ProfileLogin } from '../../shared/models/Profile';

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

  constructor(private fb: FormBuilder, private router: Router, private accountService: AccountService) {
    // Formulaire complet avec tous les champs de la maquette
    this.newOrganizerForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      organization: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.existingOrganizerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  switchToNewOrganizer() {
    this.isNewOrganizer = true;
  }

  switchToExistingOrganizer() {
    this.isNewOrganizer = false;
  }

  onNewOrganizerSubmit() {
    if (this.newOrganizerForm.valid) {
      const formValue = this.newOrganizerForm.value;

      // Adapter les champs pour coller avec le modèle backend
      const profile = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        organization: formValue.organization,
        phone: formValue.phone,
        email: formValue.email,
        password: formValue.password,
        roleId: 1 // 👈 rôle Admin par défaut
      };

      this.accountService.signup(profile).subscribe({
        next: (response) => {
          console.log('Admin créé avec succès !', response);
          this.router.navigate(['/organizer-dashboard']);
        },
        error: (error) => {
          console.error('Erreur lors de la création du compte admin :', error);
          alert('Erreur lors de la création du compte. Vérifiez vos informations.');
        }
      });
    }
  }

  onExistingOrganizerSubmit() {
    if (this.existingOrganizerForm.valid) {
      const credentials: ProfileLogin = this.existingOrganizerForm.value;

      this.accountService.login(credentials).subscribe({
        next: (token) => {
          console.log('Connexion réussie, token :', token);
          localStorage.setItem('jwt', token);
          this.router.navigate(['/organizer-dashboard']);
        },
        error: (error) => {
          console.error('Erreur de connexion :', error);
          alert('Email ou mot de passe incorrect.');
        }
      });
    }
  }

}
