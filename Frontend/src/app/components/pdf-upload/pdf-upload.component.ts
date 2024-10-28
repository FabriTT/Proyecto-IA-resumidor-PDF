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
  audioPath: string = ''; 

  constructor(private pdfUploadService: PdfUploadServiceService) {}

  onUpload(pdfFile: File) {
    this.isLoading = true;

    this.pdfUploadService.uploadPdf(pdfFile).subscribe({
      next: (response) => {
        this.resumen = response.resumen;
        this.fragmentos = response.fragmentos;
        this.audioPath = response.audio_path;
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
  playAudio() {
    if (!this.audioPath) {
      this.errorMessage = 'No hay audio disponible';
      return;
    }

    this.pdfUploadService.getAudio(this.audioPath).subscribe({
      next: (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Error al reproducir el audio: ' + error.message;
      },
    });
  }
}
