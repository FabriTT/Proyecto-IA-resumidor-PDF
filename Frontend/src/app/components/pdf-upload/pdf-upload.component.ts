import { Component } from '@angular/core';
import { PdfUploadServiceService } from '../../services/pdf-upload-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-upload.component.html',
  styleUrl: './pdf-upload.component.css',
})
export class PdfUploadComponent {
  resumen: string = '';
  fragmentos: string[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private pdfUploadService: PdfUploadServiceService) {}

  onUpload(pdfFile: File) {
    this.isLoading = true;

    this.pdfUploadService.uploadPdf(pdfFile).subscribe({
      next: (response) => {
        this.resumen = response.resumen;
        this.fragmentos = response.fragmentos;
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Error al procesar el PDF: ' + error.message;
        this.resumen = '';
        this.fragmentos = [];
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.onUpload(file);
    }
  }

  // Método para reproducir el resumen en voz
  playTextToSpeech(text: string) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'es-ES'; // Puedes cambiar el idioma si es necesario
    speech.pitch = 1; // Tono
    speech.rate = 1; // Velocidad
    window.speechSynthesis.speak(speech);
  }
}
