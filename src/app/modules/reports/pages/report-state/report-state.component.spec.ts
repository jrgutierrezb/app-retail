import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStateComponent } from './report-state.component';

describe('ReportStateComponent', () => {
  let component: ReportStateComponent;
  let fixture: ComponentFixture<ReportStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
