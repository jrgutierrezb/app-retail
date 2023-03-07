import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTypeRequestComponent } from './report-type-request.component';

describe('ReportTypeRequestComponent', () => {
  let component: ReportTypeRequestComponent;
  let fixture: ComponentFixture<ReportTypeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTypeRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTypeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
