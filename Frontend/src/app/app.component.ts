import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfUploadComponent } from './components/pdf-upload/pdf-upload.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PdfUploadComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
