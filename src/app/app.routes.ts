import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'recipes/details', component: RecipeDetailsComponent },
];
