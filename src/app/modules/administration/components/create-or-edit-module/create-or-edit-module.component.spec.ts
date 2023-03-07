import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditModuleComponent } from './create-or-edit-module.component';

describe('CreateOrEditModuleComponent', () => {
  let component: CreateOrEditModuleComponent;
  let fixture: ComponentFixture<CreateOrEditModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrEditModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
