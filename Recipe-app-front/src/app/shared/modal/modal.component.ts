import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
    selector: 'modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id?: string;
    isOpen = false;
    @Input() recipeId?: number;
    private element: any;

    constructor(private modalService: ModalService, private el: ElementRef) {
        // Das Element dieser Modal-Komponente wird im Konstruktor durch die ElementRef-Instanz erfasst.
        this.element = el.nativeElement;
    }

    ngOnInit() {
        // Füge diese Modal-Instanz dem ModalService hinzu, damit es von jeder Komponente aus geöffnet werden kann.
        this.modalService.add(this);

        // Verschiebe das Element ans Ende der Seite (kurz vor </body>), damit es über allem anderen angezeigt werden kann.
        document.body.appendChild(this.element);
    }

    ngOnDestroy() {
        // Entferne diese Modal-Instanz aus dem ModalService.
        this.modalService.remove(this);

        // Entferne das Modal-Element aus dem HTML.
        this.element.remove();
    }

    open() {
        // Zeige das Modal-Element an und füge der body-Klasse 'modal-open' hinzu, um das Scrollen zu verhindern.
        this.element.style.display = 'block';
        document.body.classList.add('modal-open');
        this.isOpen = true;
    }

    close() {
        // Verstecke das Modal-Element und entferne 'modal-open' von der body-Klasse, um das Scrollen wieder zu erlauben.
        this.element.style.display = 'none';
        document.body.classList.remove('modal-open');
        this.isOpen = false;
    }
}
