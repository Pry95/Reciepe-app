import { Injectable } from '@angular/core';

//declariert ein globale varaible
declare var bootstrap: any;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  
  // Zeige einen Toast mit Titel, Nachricht, Farbe und optionaler Verzögerung
  showToast(
    title: string,
    message: string,
    color: 'green' | 'red', // Die Farbe des Toasts: grün oder rot
    delay: number = 5000 // Verzögerung in Millisekunden (Standard: 5000 ms)
  ) {
    // Erstelle ein neues div-Element für den Toast
    const toastEl = document.createElement('div');
    // Füge der toastEl-Klasse die CSS-Klasse "toast" hinzu
    toastEl.classList.add('toast');

    // Setze das "role"-Attribut auf "alert" für Barrierefreiheit
    toastEl.setAttribute('role', 'alert');

    // Setze das "aria-live"-Attribut auf "assertive" für Barrierefreiheit
    toastEl.setAttribute('aria-live', 'assertive');

    // Setze das "aria-atomic"-Attribut auf "true" für Barrierefreiheit
    toastEl.setAttribute('aria-atomic', 'true');

    // Setze den inneren HTML-Inhalt des toastEl-Elements mit Hilfe von Template-Literalen
    toastEl.innerHTML = `
      <!-- Header des Toasts -->
      <div class="toast-header" style="background-color: #fff;">
        <strong class="me-auto" style="color: ${
          color === 'green' ? 'rgba(70, 130, 180)' : 'rgba(220, 53, 69)'
        }; font-weight: bold;">${title}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <!-- Körper des Toasts -->
      <div class="toast-body d-flex justify-content-center align-items-center" style="background-color: ${
        color === 'green' ? 'rgba(70, 130, 180)' : 'rgba(220, 53, 69)'
      };">
        <strong style="font-size: 1.5rem; color: white; font-weight: bold;">${message}</strong>
      </div>
      <!-- Ladeleiste -->
      <div class="progress" style="height: 4px;">
        <div class="progress-bar" style="width: 0%;" role="progressbar"></div>
      </div>
    `;
  
    // Stilisierung des Toasts
    toastEl.style.top = '20px';
    toastEl.style.left = '50%';
    toastEl.style.transform = 'translateX(-50%)';
    toastEl.style.position = 'fixed';
    toastEl.style.borderRadius = '12px';
    toastEl.style.backgroundColor = 'white'; // Hintergrundfarbe
    toastEl.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.9)'; // Schatten
  
    // Füge das Toast-Element zum HTML-Body hinzu
    document.body.appendChild(toastEl);
    
    // Erstelle einen Bootstrap-Toast und zeige ihn an
    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: delay });
    toast.show();
  
    // Starte die Animation der Ladeleiste
    const progressBar = toastEl.querySelector('.progress-bar');
    const animation = progressBar.animate([{ width: '0%' }, { width: '100%' }], { duration: delay, easing: 'linear' });
  
    
  }
}
