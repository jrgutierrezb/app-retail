import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditMailSettingComponent } from './create-or-edit-mail-setting.component';

describe('CreateOrEditMailSettingComponent', () => {
  let component: CreateOrEditMailSettingComponent;
  let fixture: ComponentFixture<CreateOrEditMailSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditMailSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrEditMailSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
