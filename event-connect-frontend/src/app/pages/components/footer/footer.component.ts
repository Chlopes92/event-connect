import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // Variables pour contrôler les liens du footer
  legalEnabled = false;
  privacyEnabled = false;
  cgvEnabled = false;
  contactEnabled = false;
  savEnabled = false;
}