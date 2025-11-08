import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isScrolled = false;
  isVisible = true;
  isHomePage = false;
  lastScrollPosition = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    // Vérifie si on est sur la home page au chargement
    this.checkIfHomePage(this.router.url);

    // Écoute les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkIfHomePage(event.url);
      });
  }

  checkIfHomePage(url: string) {
    // Détecte si on est sur la home page
    this.isHomePage = url === '/' || url === '/home';
    
    // Si on n'est pas sur la home, le header est toujours solide
    if (!this.isHomePage) {
      this.isScrolled = true;
    } else {
      // Sur la home, on vérifie la position du scroll
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      this.isScrolled = scrollPosition > 100;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    // Ne change l'état transparent/solide que sur la home page
    if (this.isHomePage) {
      this.isScrolled = scrollPosition > 100;
    }

    // Gestion de la visibilité du header (masquage au scroll down)
    if (scrollPosition > this.lastScrollPosition && scrollPosition > 100) {
      // Scroll vers le bas
      this.isVisible = false;
    } else {
      // Scroll vers le haut
      this.isVisible = true;
    }
    
    this.lastScrollPosition = scrollPosition;
  }

  scrollToEvents(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    
    const element = document.getElementById('events-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
