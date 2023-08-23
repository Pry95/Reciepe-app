import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFriendsModalComponent } from './edit-friends-modal.component';

describe('EditFriendsModalComponent', () => {
  let component: EditFriendsModalComponent;
  let fixture: ComponentFixture<EditFriendsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditFriendsModalComponent]
    });
    fixture = TestBed.createComponent(EditFriendsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
