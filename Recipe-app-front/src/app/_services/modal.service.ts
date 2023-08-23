import { Injectable } from '@angular/core';
import { ModalComponent } from '../shared/modal/modal.component';

// root bedeuted das sie auf der ganzen Angular anwendung verfügbar sind
@Injectable({ providedIn: 'root' })
export class ModalService {
    private modals: ModalComponent[] = []; // Ein Array, um aktive Modals zu speichern

    // Füge ein Modal zur Liste der aktiven Modals hinzu
    add(modal: ModalComponent) {
        // Stelle sicher, dass das Komponente eine eindeutige "id"-Eigenschaft hat
        if (!modal.id || this.modals.find(x => x.id === modal.id)) {
            throw new Error('modal must have a unique id attribute');
        }

        // Füge das Modal zum Array der aktiven Modals hinzu
        this.modals.push(modal);
    }

    // Entferne ein Modal aus der Liste der aktiven Modals
    remove(modal: ModalComponent) {
        // Entferne das Modal aus dem Array der aktiven Modals
        this.modals = this.modals.filter(x => x !== modal);
    }

    // Öffne ein Modal basierend auf seiner "id"-Eigenschaft
    open(id: string, recipeId?: any) {
        // Suche das Modal in der Liste der aktiven Modals
        const modal = this.modals.find(x => x.id === id);

        if (!modal) {
            throw new Error(`modal '${id}' not found`);
        }

        // Öffne das gefundenen Modal
        modal.open();
    }

    // Schließe das aktuell geöffnete Modal
    close() {
        console.log('close modal');
        // Finde das Modal, das derzeit geöffnet ist
        const modal = this.modals.find(x => x.isOpen);
        modal?.close(); // Schließe das Modal, falls es existiert und geöffnet ist
    }
}