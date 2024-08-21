import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Recipe } from '../model/recipe';
import { toSignal } from '@angular/core/rxjs-interop';
export const BASE_PATH = environment.basePath;

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private http = inject(HttpClient);

  filterRecipe = signal({ title: '' } as Recipe);

  recipes$ = this.http.get<Recipe[]>(`${BASE_PATH}/recipes`)
    .pipe(catchError(() => of([])));

  recipes = toSignal(
    this.http.get<Recipe[]>(`${BASE_PATH}/recipes`),
    { initialValue: [] as Recipe[] }
  )

  updateFilter(criteria: Recipe) {
    this.filterRecipe.set(criteria);
  }

  saveRecipe(formValue: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${BASE_PATH}/recipes/save`, formValue);
  }
}
