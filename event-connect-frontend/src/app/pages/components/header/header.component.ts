import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isScrolled = false;
  isVisible = true;
  isHomePage = false;
  lastScrollPosition = 0;

  isMenuOpen = false;

  wishlistEnabled = false;
  ticketEnabled = false;
  aboutEnabled = false;

  constructor(private readonly router: Router) {}

  ngOnInit() {

    this.checkIfHomePage(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkIfHomePage(event.url);
      });

  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  checkIfHomePage(url: string) {

    this.isHomePage = url === '/' || url === '/home';

    if (this.isHomePage) {

      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;

      this.isScrolled = scrollPosition > 100;

    } else {

      this.isScrolled = true;

    }

  }

  @HostListener('window:scroll', [])
  onWindowScroll() {

    const scrollPosition =
      window.scrollY || document.documentElement.scrollTop;

    if (this.isHomePage) {
      this.isScrolled = scrollPosition > 100;
    }

    if (scrollPosition > this.lastScrollPosition && scrollPosition > 100) {
      this.isVisible = false;
    } else {
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
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

  }

  @HostListener('window:resize', [])
  onResize() {
  if (window.innerWidth > 776) {
    this.isMenuOpen = false;
  }
}

}