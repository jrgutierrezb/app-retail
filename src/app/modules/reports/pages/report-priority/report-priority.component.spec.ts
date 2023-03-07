import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPriorityComponent } from './report-priority.component';

describe('ReportPriorityComponent', () => {
  let component: ReportPriorityComponent;
  let fixture: ComponentFixture<ReportPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPriorityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
