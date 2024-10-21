import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfUploadServiceService {

  private apiUrl = 'http://localhost:8000/procesar_pdf/'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  uploadPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', file, file.name);
    
    return this.http.post<any>(this.apiUrl, formData);
  }
}
