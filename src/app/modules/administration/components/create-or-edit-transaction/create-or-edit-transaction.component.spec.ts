import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditTransactionComponent } from './create-or-edit-transaction.component';

describe('CreateOrEditTransactionComponent', () => {
  let component: CreateOrEditTransactionComponent;
  let fixture: ComponentFixture<CreateOrEditTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrEditTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
