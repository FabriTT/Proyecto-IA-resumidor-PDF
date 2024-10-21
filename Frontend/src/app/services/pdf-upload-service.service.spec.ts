import { TestBed } from '@angular/core/testing';

import { PdfUploadServiceService } from './pdf-upload-service.service';

describe('PdfUploadServiceService', () => {
  let service: PdfUploadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfUploadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
