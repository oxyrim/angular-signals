import { Component, input, model } from '@angular/core';
import { Recipe } from '../../core/model/recipe';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  recipe = input.required<Recipe | undefined>();
  title = model('');
}
