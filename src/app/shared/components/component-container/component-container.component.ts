import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-container',
  templateUrl: './component-container.component.html',
  styleUrls: ['./component-container.component.scss']
})
export class ComponentContainerComponent implements AfterContentInit, AfterViewInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.markForCheck();
  }

}
