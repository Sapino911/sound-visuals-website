import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  protected submitted = false;
  protected sending = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    eventType: ['', Validators.required],
    eventDate: ['', Validators.required],
    details: ['', [Validators.required, Validators.minLength(20)]]
  });

  protected hasError(controlName: 'name' | 'email' | 'eventType' | 'eventDate' | 'details', error: string): boolean {
    const control = this.contactForm.controls[controlName];
    return control.hasError(error) && (control.touched || this.submitted);
  }

  protected submitEnquiry(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const enquiry = this.contactForm.getRawValue();
    this.sending = true;

    this.http.post<{ message: string; id: string }>('/api/contact', enquiry).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.contactForm.reset();
        this.submitted = false;
        this.sending = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Unable to send your enquiry. Please try again.';
        this.sending = false;
      }
    });
  }

  private getEventTypeLabel(value: string): string {
    const labels: Record<string, string> = {
      corporate: 'Corporate event',
      launch: 'Product launch',
      live: 'Live production',
      private: 'Private function'
    };

    return labels[value] ?? 'Event enquiry';
  }
}
