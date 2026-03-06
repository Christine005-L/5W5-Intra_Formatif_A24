import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators, ReactiveFormsModule, FormGroup, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatToolbarModule, MatIconModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AppComponent {
  title = 'reactive.form';

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        roadnumber: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]],
        postalcode: ['', []],
        comments: ['', [minWords(10)]]
      },
      {
        validators: nomDansCommentaire()
      }
    );
  }
}

export function minWords(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null;

    const words = control.value.trim().split(" ");

    const estValide = words.length >= min;

    return estValide ? null : { minWords: true }
  };
}

export function nomDansCommentaire(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const comments = control.get('comments')?.value;
    const name = control.get('name')?.value;
    // On regarde si le champ est rempli avant de faire la validation
    if (!comments|| !name) {
      // On attend que le champ soit rempli avant de le valider
      return null;
    }
    // On fait notre validation. Includes retourne un booléen.
    const estValide = !comments.includes(name);

    return estValide ? null : { nomDansCommentaire: true }
  };
}


