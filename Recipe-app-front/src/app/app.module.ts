import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipesDetailComponent } from './recipes/recipes-detail/recipes-detail.component';
import { RecipesItemComponent } from './recipes/recipes-list/recipes-item/recipes-item.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddComponent } from './friends/add/add.component';
import { FriendsListComponent } from './friends/friends-list/friends-list.component';
import { FriendsComponent } from './friends/friends.component';
import { PossibleFriendsListComponent } from './friends/add/possible-friends-list/possible-friends-list.component';
import { PossibleFriendsItemComponent } from './friends/add/possible-friends-list/possible-friends-item/possible-friends-item.component';
import { FriendRequestListComponent } from './friends/friend-request-list/friend-request-list.component';
import { FriendRequestItemComponent } from './friends/friend-request-list/friend-request-item/friend-request-item.component';
import { FriendsListItemComponent } from './friends/friends-list/friends-list-item/friends-list-item.component';
import { ListItemComponent } from './home/public-recipes/pulic-recipes-list/list-item/list-item.component';
import { SearchPulicRecipesComponent } from './home/public-recipes/search-pulic-recipes/search-public-recipes.component';
import { PulicRecipesListComponent } from './home/public-recipes/pulic-recipes-list/pulic-recipes-list.component';




//Hier sind meine Services
import { CopiedService } from './_services/copied.service';
import { RatingService } from './_services/rating.serive';
import { FriendsService } from './_services/friens.service';
import { RecipeService } from './_services/recipe.service';
import { ShoppingListService } from './shopping-list/shopping-list.service';

// Hier sind meine Modale
import { ModalComponent } from './shared/modal/modal.component';
import { FriendsrequestmodalComponent } from './_modals/friendsrequestmodal/friendsrequestmodal.component';
import { FriendssearchmodalComponent } from './_modals/friendssearchmodal/friendssearchmodal.component';
import { NewRecipemodalComponent } from './_modals/new-recipemodal/new-recipemodal.component';
import { EditFriendsModalComponent } from './_modals/edit-friends-modal/edit-friends-modal.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { RatingModalComponent } from './_modals/rating-modal/rating-modal.component';
import { HomeStartComponent } from './home/home-start/home-start.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    RecipesComponent,
    RecipesComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    RecipeStartComponent,
    RecipeEditComponent,
    RecipesListComponent,
    RecipesItemComponent,
    RecipesDetailComponent,
    AddComponent,
    FriendsListComponent,
    FriendsComponent,
    PossibleFriendsListComponent,
    PossibleFriendsItemComponent,
    FriendRequestListComponent,
    FriendRequestItemComponent,
    FriendsListItemComponent,
    SearchPulicRecipesComponent,
    PulicRecipesListComponent,
    ListItemComponent,
    ModalComponent,
    FriendsrequestmodalComponent,
    FriendssearchmodalComponent,
    NewRecipemodalComponent,
    EditFriendsModalComponent,
    StarRatingComponent,
    RatingModalComponent,
    HomeStartComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
  ],
  providers: [
    authInterceptorProviders,
    ShoppingListService,
    RecipeService,
    FriendsService,
    CopiedService,
    RatingService,
 
    { provide: LocationStrategy
      , useClass: HashLocationStrategy 
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
