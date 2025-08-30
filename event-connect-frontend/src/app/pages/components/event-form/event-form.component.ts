import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

@Component({
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent {
  eventForm: FormGroup;
  toasts: Toast[] = [];
  imagePreview: string | null = null;
  isDragOver: boolean = false;
  categories: string[] = ['Conférence', 'Formation', 'Atelier', 'Séminaire', 'Webinaire'];

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      participants: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      contact: ['', Validators.required]
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log('Formulaire soumis:', this.eventForm.value);
      this.addToast('success', 'Événement créé avec succès !');
    } else {
      this.addToast('error', 'Veuillez corriger les erreurs dans le formulaire.');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.onFileSelected({ target: { files } });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
    }
    return '';
  }

  goBack() {
    // Navigation vers la page précédente
    window.history.back();
  }

  removeImage() {
    this.imagePreview = null;
  }

  private addToast(type: 'success' | 'error' | 'warning', message: string) {
    const toast: Toast = {
      id: Date.now(),
      type,
      message
    };
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 5000);
  }
}
