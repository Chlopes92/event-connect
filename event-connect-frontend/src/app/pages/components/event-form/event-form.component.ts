import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EVENTS_MOCK } from '../../../mocks/events.mock';
import { CategoryService } from '../../../services/category/category.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../shared/models/Category';

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
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  toasts: Toast[] = [];
  imagePreview: string | null = null;
  isEditMode: boolean = false;
  isDragOver: boolean = false;
  categories: Category[] = [];

  private categoryService = inject(CategoryService);

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      participants: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      contact: ['', Validators.required],
      price: [''],
      programs: ['']
    });
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.isEditMode = true;
      const eventToEdit = EVENTS_MOCK.find(e => e.id === +eventId);
      if (eventToEdit) {
        this.eventForm.patchValue({
          title: eventToEdit.title,
          date: eventToEdit.date,
          // participants: eventToEdit.participants,
          // location: eventToEdit.location,
          category: eventToEdit.id,
          description: eventToEdit.description,
          contact: eventToEdit.contact,
          price: eventToEdit.price,
          // programs: eventToEdit.programs
        });
        this.imagePreview = eventToEdit.image;
      }
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      if (this.isEditMode) {
        console.log('Mise à jour de l’événement :', this.eventForm.value);
        this.addToast('success', 'Événement mis à jour avec succès ✅');
      } else {
        console.log('Création d’un nouvel événement :', this.eventForm.value);
        this.addToast('success', 'Événement créé avec succès 🎉');
      }
    } else {
      this.addToast('error', 'Veuillez corriger les erreurs dans le formulaire ❌');
    }
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
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
    window.history.back(); // Navigation vers la page précédente
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
