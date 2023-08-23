import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendssearchmodalComponent } from './friendssearchmodal.component';

describe('FriendssearchmodalComponent', () => {
  let component: FriendssearchmodalComponent;
  let fixture: ComponentFixture<FriendssearchmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendssearchmodalComponent]
    });
    fixture = TestBed.createComponent(FriendssearchmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
