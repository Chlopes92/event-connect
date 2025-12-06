import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../shared/models/Category';
import { EventService } from '../../../services/event/event.service';
import { Event } from '../../../shared/models/Event';

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
  today: string = '';
  eventId: number | null = null;
  isLoading: boolean = false;

  private categoryService = inject(CategoryService);
  private eventService = inject(EventService);
  private router = inject(Router);

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      participants: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      contact: ['', [Validators.required, Validators.email]],
      price: [''],
      programs: ['']
    });
  }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];

    // Charger les catégories
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Catégories chargées:', categories);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.addToast('error', 'Erreur lors du chargement des catégories');
      }
    });

    // Vérifier si on est en mode édition
    const eventIdParam = this.route.snapshot.paramMap.get('id');
    if (eventIdParam) {
      this.eventId = +eventIdParam;
      this.isEditMode = true;
      this.loadEventData(this.eventId);
    }
  }

  loadEventData(id: number): void {
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        console.log('Événement chargé:', event);
        
        // Patcher les valeurs du formulaire
        this.eventForm.patchValue({
          title: event.nameEvent,
          date: event.dateEvent,
          participants: event.numberPlace,
          location: event.address,
          category: event.categories && event.categories.length > 0 ? event.categories[0].id : '',
          description: event.description,
          contact: event.contact,
          price: event.price || '',
          programs: event.program || ''
        });
        
        this.imagePreview = event.imgUrl || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'événement:', error);
        this.addToast('error', 'Erreur lors du chargement de l\'événement');
        this.isLoading = false;
        // Rediriger vers la liste après 2 secondes
        setTimeout(() => this.router.navigate(['/organizer-dashboard']), 2000);
      }
    });
  }

  onSubmit(): void {
    // Marquer tous les champs comme touched pour afficher les erreurs
    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.markAsTouched();
    });

    if (this.eventForm.invalid) {
      this.addToast('error', 'Veuillez corriger les erreurs dans le formulaire ❌');
      return;
    }

    this.isLoading = true;
    const formValue = this.eventForm.value;

    // Trouver la catégorie sélectionnée
    const selectedCategory = this.categories.find(cat => cat.id === +formValue.category);
    
    if (!selectedCategory) {
      this.addToast('error', 'Catégorie invalide');
      this.isLoading = false;
      return;
    }

    // Construire l'objet Event selon l'interface
    const eventData: Event = {
      nameEvent: formValue.title,
      description: formValue.description,
      dateEvent: formValue.date,
      program: formValue.programs || '',
      contact: formValue.contact,
      price: formValue.price ? +formValue.price : undefined,
      numberPlace: formValue.participants ? +formValue.participants : undefined,
      address: formValue.location,
      imgUrl: this.imagePreview || undefined,
      categories: [selectedCategory]
    };

    if (this.isEditMode && this.eventId) {
      // Mode édition - UPDATE
      eventData.id = this.eventId;
      
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: (response) => {
          console.log('Événement mis à jour:', response);
          this.addToast('success', 'Événement mis à jour avec succès ✅');
          this.isLoading = false;
          // Redirection après 2 secondes
          setTimeout(() => this.router.navigate(['/organizer-dashboard']), 2000);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.addToast('error', 'Erreur lors de la mise à jour de l\'événement ❌');
          this.isLoading = false;
        }
      });
    } else {
      // Mode création - CREATE
      this.eventService.createEvent(eventData).subscribe({
        next: (response) => {
          console.log('Événement créé:', response);
          this.addToast('success', 'Événement créé avec succès 🎉');
          this.isLoading = false;
          // Redirection après 2 secondes
          setTimeout(() => this.router.navigate(['/organizer-dashboard']), 2000);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.addToast('error', 'Erreur lors de la création de l\'événement ❌');
          this.isLoading = false;
        }
      });
    }
  }

  deleteEvent(): void {
    if (!this.eventId || !this.isEditMode) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    this.isLoading = true;
    this.eventService.deleteEvent(this.eventId).subscribe({
      next: (response) => {
        console.log('Événement supprimé:', response);
        this.addToast('success', 'Événement supprimé avec succès 🗑️');
        this.isLoading = false;
        // Redirection après 1.5 secondes
        setTimeout(() => this.router.navigate(['/organizer-dashboard']), 1500);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.addToast('error', 'Erreur lors de la suppression de l\'événement ❌');
        this.isLoading = false;
      }
    });
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérification de la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.addToast('error', 'L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Vérification du type
      if (!file.type.startsWith('image/')) {
        this.addToast('error', 'Le fichier doit être une image');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
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
      if (field.errors['email']) {
        return 'Email invalide';
      }
      if (field.errors['min']) {
        return 'La valeur doit être supérieure à 0';
      }
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/organizer-dashboard']);
  }

  removeImage(): void {
    this.imagePreview = null;
  }

  private addToast(type: 'success' | 'error' | 'warning', message: string): void {
    const toast: Toast = {
      id: Date.now(),
      type,
      message
    };
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 5000);
  }
}
