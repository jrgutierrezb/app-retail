import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePermissionComponent } from './profile-permission.component';

describe('ProfilePermissionComponent', () => {
  let component: ProfilePermissionComponent;
  let fixture: ComponentFixture<ProfilePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilePermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
