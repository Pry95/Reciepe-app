import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecipemodalComponent } from './new-recipemodal.component';

describe('NewRecipemodalComponent', () => {
  let component: NewRecipemodalComponent;
  let fixture: ComponentFixture<NewRecipemodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewRecipemodalComponent]
    });
    fixture = TestBed.createComponent(NewRecipemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
