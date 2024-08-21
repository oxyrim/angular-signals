import { Component, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipes-filter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './recipes-filter.component.html',
  styleUrl: './recipes-filter.component.scss'
})
export class RecipesFilterComponent {

  filter = model.required({ alias: 'filterCriteria' });

}
