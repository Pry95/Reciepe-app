import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsrequestmodalComponent } from './friendsrequestmodal.component';

describe('FriendsrequestmodalComponent', () => {
  let component: FriendsrequestmodalComponent;
  let fixture: ComponentFixture<FriendsrequestmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsrequestmodalComponent]
    });
    fixture = TestBed.createComponent(FriendsrequestmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
