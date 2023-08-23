
import { Component, OnInit,  } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../_services/toast.service';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    confirmPassword: null,  // Neuer Formulareintrag für die Passwortbestätigung
    image: null 
  };

  imagePath: string = 'http://localhost:8080/resources/rezeptBuchLogoNew.jpg';
  imageUrl: string;
  selectedImag: File;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isLoggedIn: boolean;

  constructor(private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
      private router: Router,
      private toastService: ToastService,
    ) { 
      
    }
    userName: string;
    ngOnInit(): void {
      this.isLoggedIn = !!this.tokenStorage.getToken();
      
      
      if (this.isLoggedIn) {
        this.userName = this.tokenStorage.getUser.name
        this.router.navigate(['/home'], { relativeTo: this.route });
        this.toastService.showToast('Registration erfolgreich', 'Herzlich wilkommen' , 'green', 5000);
      }
    }
  

  
  onSubmit() {
    if (this.form.password !== this.form.confirmPassword) {
      // zeige eine Fehlermeldung an
      this.errorMessage = 'Passwörter stimmen nicht überein';
      this.isSignUpFailed = true;
      return;
    }
  
    const formData = new FormData();
    formData.append('username', this.form.username);
    formData.append('email', this.form.email);
    formData.append('password', this.form.password);
  
    if (this.selectedImag) {
      formData.append('image', this.selectedImag, this.selectedImag.name);
    }
  
    // Rufe die Register-Funktion auf und übergebe das FormData-Objekt
    this.authService.register(formData).subscribe({
      next: (data) => {
        // Erfolgsbehandlung
           
            this.tokenStorage.saveToken(data.accessToken);
            this.tokenStorage.saveUser(data);
            
            this.isLoggedIn = true;
            window.location.reload();

            this.isSuccessful = true;
            this.isSignUpFailed = false;
            
        
        
        
      },
      error: (error) => {
        // Fehlerbehandlung
        console.log(error)
        this.errorMessage = error.message;
        this.isSignUpFailed = true;
      }
    });
    
  }
  

  onFileSelected(event: any) {
    this.selectedImag = event.target.files[0];

    if (this.selectedImag) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };

      reader.readAsDataURL(this.selectedImag);
    }
  }
}
