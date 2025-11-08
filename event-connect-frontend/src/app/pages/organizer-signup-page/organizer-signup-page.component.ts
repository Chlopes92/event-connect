import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-organizer-signup-page',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './organizer-signup-page.component.html',
  styleUrl: './organizer-signup-page.component.css'
})
export class OrganizerSignupPageComponent {
  isNewClient = true;
  newClientForm: FormGroup;
  existingClientForm: FormGroup;
  router: any;

  constructor(private fb: FormBuilder) {
    this.newClientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      nomOrganisation: ['', Validators.required],
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
      console.log('New Client:', this.newClientForm.value);
      alert('Compte créé avec succès!');
    }
  }

  onExistingClientSubmit() {
    if (this.existingClientForm.valid) {
      console.log('Existing Client:', this.existingClientForm.value);
      alert('Connexion réussie!');
    }
  }

}
