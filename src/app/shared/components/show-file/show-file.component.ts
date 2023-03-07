import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.css']
})
export class ShowFileComponent implements OnInit {

  public liveDemoVisible = false;
  public url = '';
  public base64 = '';

  constructor(
    protected _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  async toggleLiveDemo(base64Data?:string) {
    this.url = '';
    if(!this.liveDemoVisible) {
      this.base64 = base64Data;
      const base64Response = await fetch(base64Data);
      const blob = await base64Response.blob();
      const blobUrl = URL.createObjectURL(blob);
      this.url = blobUrl;
    }
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

  documentPdfURL() {
    return this._sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  Descargar(name) {
    const linkSource = this.base64;
     const downloadLink = document.createElement("a");
     downloadLink.href = linkSource;
     downloadLink.download = name;
     downloadLink.click();
  }

  
}
