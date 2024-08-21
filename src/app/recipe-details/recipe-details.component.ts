import { Component, inject } from '@angular/core';
import { SharedDataService } from '../core/services/shared-data.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent {
  private sharedService = inject(SharedDataService);
  selectedRecipe = toSignal(this.sharedService.recipe$)

}
