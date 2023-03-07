import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditProfilePermissionComponent } from './create-or-edit-profile-permission.component';

describe('CreateOrEditProfilePermissionComponent', () => {
  let component: CreateOrEditProfilePermissionComponent;
  let fixture: ComponentFixture<CreateOrEditProfilePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditProfilePermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrEditProfilePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
