import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RecipesService } from '../core/services/recipes.service';
import { CommonModule } from '@angular/common';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from '../core/model/recipe';
import { SharedDataService } from '../core/services/shared-data.service';
import { Router } from '@angular/router';
import { RecipesFilterComponent } from '../recipes-filter/recipes-filter.component';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbRatingModule,
    RecipesFilterComponent
  ],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent {
  private service = inject(RecipesService);
  private sharedDataService = inject(SharedDataService);
  private router = inject(Router)

  recipes = this.service.recipes;
  filterCriteria = signal('');

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

  filteredRecipes = computed(() => {
    const filterTitle = this.filterCriteria().toLocaleLowerCase() ?? '';
    return this.recipes().filter(recipe =>
      recipe?.title?.toLowerCase().includes(filterTitle));
  });

  viewRecipe(recipe: Recipe) {
    this.sharedDataService.updateSelectedRecipe(recipe.id);
    this.router.navigate(['/recipes/details']);
  }
}
