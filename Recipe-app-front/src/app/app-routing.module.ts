import {  NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesDetailComponent } from './recipes/recipes-detail/recipes-detail.component';
import { AuthGuard } from './guards/auth-gurad.service';
import { HomeStartComponent } from './home/home-start/home-start.component';



const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, children:[
    {path: ':index',
          component: RecipesDetailComponent,},
          { path: '', component:HomeStartComponent },
  ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'recipes', component: RecipesComponent,canActivate: [AuthGuard], children:[
      {path: '', component: RecipeStartComponent},
      {path: 'new',component: RecipeEditComponent},
      {path: ':index',component: RecipesDetailComponent},      
      {   path: ':index/edit',component: RecipeEditComponent,},
  ]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
