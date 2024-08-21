import { Injectable, inject, signal } from '@angular/core';
import { Recipe } from '../model/recipe';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BASE_PATH } from './recipes.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private http = inject(HttpClient);

  selectedRecipeId = signal<number | undefined>(undefined);

  recipe$ = toObservable(this.selectedRecipeId).pipe(
    filter(Boolean),
    switchMap(id =>
      this.http.get<Recipe>(`${BASE_PATH}/recipes/${id}`)
    )
  );

  updateSelectedRecipe(id: number | undefined) {
    this.selectedRecipeId.set(id);
  }

}
