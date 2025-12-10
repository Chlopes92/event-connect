import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-signup-page',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './client-signup-page.component.html',
  styleUrl: './client-signup-page.component.css'
})
export class ClientSignupPageComponent {
  isNewClient = true;
  newClientForm: FormGroup;
  existingClientForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // Formulaire complet avec tous les champs de la maquette
    this.newClientForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      phone: ['', Validators.required],
      organisation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.existingClientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  switchToNewClient() {
    this.isNewClient = true;
  }

  switchToExistingClient() {
    this.isNewClient = false;
  }

  onNewClientSubmit() {
    if (this.newClientForm.valid) {
      // Naviguer vers le dashboard après création du compte
      this.router.navigate(['/']);
    }
  }

  onExistingClientSubmit() {
    if (this.existingClientForm.valid) {
      // Naviguer vers le dashboard après connexion
      this.router.navigate(['/']);
    }
  }

}
