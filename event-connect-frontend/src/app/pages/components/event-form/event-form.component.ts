import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../shared/models/Category';
import { EventService } from '../../../services/event/event.service';
import Swal from 'sweetalert2';

/**
 * Interface Toast pour les notifications
 */
interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

/**
 * Composant de formulaire d'événement
 * 
 * Fonctionnalités :
 * - Création et édition d'événements
 * - Upload d'images avec prévisualisation
 * - Sélection multiple de catégories
 * - Validation complète avec regex
 * - Système de toasts
 */
@Component({
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  // Formulaire réactif
  eventForm: FormGroup;
  
  // Gestion de l'image
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isDragOver: boolean = false;
  
  // Système de toasts
  toasts: Toast[] = [];
  
  // État du composant
  isEditMode: boolean = false;
  isLoading: boolean = false;
  eventId: number | null = null;
  
  // Données
  categories: Category[] = [];
  today: string = '';

  // Services injectés
  readonly categoryService = inject(CategoryService);
  readonly eventService = inject(EventService);
  readonly router = inject(Router);

  /**
   * Constructor - Initialisation du formulaire avec validations
   */
  constructor(private readonly fb: FormBuilder, private readonly route: ActivatedRoute) {
    this.eventForm = this.fb.group({
      // Titre de l'événement
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      
      // Date de l'événement
      date: ['', Validators.required],
      
      // Nombre de participants
      participants: ['', [
        Validators.required, 
        Validators.min(1),
        Validators.max(10000)
      ]],
      
      // Lieu de l'événement
      location: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      
      // CORRECTION : Catégories multiples (array d'IDs)
      categories: [[], Validators.required],
      
      // Description de l'événement
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      
      // Email de contact
      contact: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      
      // Prix (optionnel)
      price: ['', [
        Validators.min(0),
        Validators.max(10000)
      ]],
      
      // Programme (optionnel)
      programs: ['', [
        Validators.minLength(10),
        Validators.maxLength(2000)
      ]]
    });
  }

  /**
   * Initialisation du composant
   */
  ngOnInit(): void {
    // Date minimale = aujourd'hui
    this.today = new Date().toISOString().split('T')[0];

    // Charger les catégories disponibles
    this.loadCategories();

    // Vérifier si on est en mode édition
    const eventIdParam = this.route.snapshot.paramMap.get('id');
    if (eventIdParam) {
      this.eventId = +eventIdParam;
      this.isEditMode = true;
      this.loadEventData(this.eventId);
    }
  }

  /**
   * Charger les catégories depuis le backend
   */
  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error: Error) => {
        console.error('❌ Erreur catégories:', error.message);
        this.addToast('error', error.message);
      }
    });
  }

  /**
   * Charger les données d'un événement existant (mode édition)
   */
  loadEventData(id: number): void {
    this.isLoading = true;
    
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        // Extraire les IDs des catégories (array)
        const categoryIds = event.categories?.map(cat => cat.id) || [];
        
        // Patcher les valeurs du formulaire
        this.eventForm.patchValue({
          title: event.nameEvent,
          date: event.dateEvent,
          participants: event.numberPlace,
          location: event.address,
          categories: categoryIds, // Array d'IDs
          description: event.description,
          contact: event.contact,
          price: event.price || '',
          programs: event.program || ''
        });

        // Forcer la validation de tous les champs
        Object.keys(this.eventForm.controls).forEach(key => {
          const control = this.eventForm.get(key);
          control?.markAsTouched();
          control?.markAsDirty();
          control?.updateValueAndValidity();
        });

        // Charger l'image si elle existe
        if(event.imgUrl) {
          this.imagePreview = this.eventService.getImageUrl(event.imgUrl);
        }

        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('❌ Erreur chargement:', error.message);
        this.addToast('error', error.message);
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/organizer-dashboard']), 2000);
      }
    });
  }

  /**
   * Soumettre le formulaire (création ou édition)
   */
  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.markAsTouched();
    });

    // Vérifier la validité du formulaire
    if (this.eventForm.invalid) {
      this.addToast('error', 'Veuillez corriger les erreurs dans le formulaire ⚠️');
      return;
    }

    this.isLoading = true;
    const formValue = this.eventForm.value;

    // Envoyer directement les IDs
    const categoryIds: number[] = formValue.categories || [];
    
    // Vérifier qu'au moins une catégorie est sélectionnée
    if (categoryIds.length === 0) {
      this.addToast('error', 'Veuillez sélectionner au moins une catégorie ⚠️');
      this.isLoading = false;
      return;
    }

    console.log('📤 Données envoyées:', {
      nameEvent: formValue.title,
      categoryIds: categoryIds,
      description: formValue.description
    });

    // Construire l'objet à envoyer au service
    const eventData: any = {
      nameEvent: formValue.title,
      description: formValue.description,
      dateEvent: formValue.date,
      program: formValue.programs || '',
      contact: formValue.contact,
      price: formValue.price ? +formValue.price : 0,
      numberPlace: +formValue.participants,
      address: formValue.location,
      categoryIds: categoryIds // Envoyer uniquement les IDs
    };

    if (this.isEditMode && this.eventId) {
      // MODE ÉDITION - UPDATE
      this.updateEvent(eventData);
    } else {
      // MODE CRÉATION - CREATE
      this.createEvent(eventData);
    }
  }

  /**
   * Créer un nouvel événement
   */
  private createEvent(eventData: any): void {
    this.eventService.createEvent(eventData, this.imageFile || undefined).subscribe({
      next: (response) => {
        this.addToast('success', '🎉 Événement créé avec succès !');
        this.isLoading = false;
        
        // Redirection après 2 secondes
        setTimeout(() => this.router.navigate(['/organizer-dashboard']), 2000);
      },
      error: (error: Error) => {
        console.error('❌ Erreur création:', error.message);
        this.addToast('error', error.message);
        this.isLoading = false;
      }
    });
  }

  /**
   * Mettre à jour un événement existant
   */
  private updateEvent(eventData: any): void {
    eventData.id = this.eventId!;
    
    this.eventService.updateEvent(this.eventId!, eventData, this.imageFile || undefined).subscribe({
      next: (response) => {
        this.addToast('success', '🎉 Événement mis à jour avec succès !');
        this.isLoading = false;
        
        // Redirection après 2 secondes
        setTimeout(() => this.router.navigate(['/organizer-dashboard']), 2000);
      },
      error: (error: Error) => {
        console.error('❌ Erreur mise à jour:', error.message);
        this.addToast('error', error.message);
        this.isLoading = false;
      }
    });
  }

  /**
   * Supprimer un événement
   */
  async deleteEvent(): Promise<void> {
    if (!this.eventId || !this.isEditMode) {
      return;
    }

    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    this.isLoading = true;
    
    this.eventService.deleteEvent(this.eventId).subscribe({
      next: (response) => {
        this.addToast('success', '🗑️ Événement supprimé avec succès !');
        this.isLoading = false;
        
        // Redirection après 1.5 secondes
        setTimeout(() => this.router.navigate(['/organizer-dashboard']), 1500);
      },
      error: (error: Error) => {
        console.error('❌ Erreur suppression:', error.message);
        this.addToast('error', error.message);
        this.isLoading = false;
      }
    });
  }


  /**
   * Gestion de la sélection de fichier image
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validation de la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.addToast('error', 'Image trop grande (max 5MB) ⚠️');
      return;
    }

    // Validation du type de fichier
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.addToast('error', 'Format d\'image non autorisé (PNG, JPG, WEBP uniquement) ⚠️');
      return;
    }

    this.imageFile = file;

    // Générer la prévisualisation
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Gestion du drag over
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  /**
   * Gestion du drag leave
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  /**
   * Gestion du drop
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.onFileSelected({ target: { files } });
    }
  }

  /**
   * Supprimer l'image sélectionnée
   */
  removeImage(): void {
    this.imagePreview = null;
    this.imageFile = null;
  }

  /**
   * Vérifier si un champ est invalide
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Obtenir le message d'erreur d'un champ
   */
  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    
    if (!field?.errors) {
      return '';
    }

    // Messages d'erreur personnalisés
    if (field.errors['required']) {
      return 'Ce champ est requis';
    }
    
    if (field.errors['email']) {
      return 'Email invalide';
    }
    
    if (field.errors['pattern']) {
      return 'Format invalide';
    }
    
    if (field.errors['min']) {
      return `Minimum: ${field.errors['min'].min}`;
    }
    
    if (field.errors['max']) {
      return `Maximum: ${field.errors['max'].max}`;
    }
    
    if (field.errors['minlength']) {
      return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    
    if (field.errors['maxlength']) {
      return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
    }

    return 'Champ invalide';
  }

  /**
   * Vérifier si une catégorie est sélectionnée
   */
  isCategorySelected(categoryId: number): boolean {
    const selectedCategories = this.eventForm.get('categories')?.value || [];
    return selectedCategories.includes(categoryId);
  }

  /**
   * Toggle une catégorie (ajouter ou retirer)
   */
  toggleCategory(categoryId: number): void {
    const selectedCategories: number[] = this.eventForm.get('categories')?.value || [];
    
    if (selectedCategories.includes(categoryId)) {
      // Retirer la catégorie
      const updated = selectedCategories.filter(id => id !== categoryId);
      this.eventForm.patchValue({ categories: updated });
    } else {
      // Ajouter la catégorie
      this.eventForm.patchValue({ categories: [...selectedCategories, categoryId] });
    }
    
    // Déclencher la validation
    this.eventForm.get('categories')?.markAsTouched();
    this.eventForm.get('categories')?.updateValueAndValidity();
  }

  /**
   * Retour à la page précédente
   */
  goBack(): void {
    this.router.navigate(['/organizer-dashboard']);
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