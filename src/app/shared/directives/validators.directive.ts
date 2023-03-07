import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FuncionesComunes } from '../class/common_functions';


@Directive({
    selector: '[appValidador][soloNumeros]'
})
export class ValidadorNumerosDirective {
  
    funcionesComunes: FuncionesComunes = new FuncionesComunes();
  
    @HostListener('keypress', ['$event']) onKeyPress(e) {
      if (!this.funcionesComunes.validaSoloNumeros(String.fromCharCode(e.charCode))) {
        e.preventDefault()
      }
    }
}


@Directive({
  selector: '[appValidador][soloLetras]'
})
export class ValidadorLetrasDirective {

  funcionesComunes: FuncionesComunes = new FuncionesComunes();

  @HostListener('keypress', ['$event']) onKeyPress(e) {
    if (!this.funcionesComunes.validaSoloCaracteres(String.fromCharCode(e.charCode))) {
      e.preventDefault()
    }
  }
}

@Directive({
    selector: '[appValidador][soloLetrasSignos]'
  })
  export class ValidadorLetrasSignosDirective {
  
    funcionesComunes: FuncionesComunes = new FuncionesComunes();
  
    @HostListener('keypress', ['$event']) onKeyPress(e) {
      if (!this.funcionesComunes.validaSoloCaracteres(String.fromCharCode(e.charCode))) {
        e.preventDefault()
      }
    }
  }
  
  @Directive({
    selector: '[appValidador][LetrasNumeros]'
  })
  export class ValidadorLetrasNumerosDirective {
  
    funcionesComunes: FuncionesComunes = new FuncionesComunes();
  
    @HostListener('keypress', ['$event']) onKeyPress(e) {
      if (!this.funcionesComunes.validaNumerosCaracteres(String.fromCharCode(e.charCode))) {
        e.preventDefault()
      }
    }
  }

  @Directive({
    selector: '[appValidador][LetrasCaract]'
  })
  export class ValidadorLetrasCaracteresDirective {
  
    funcionesComunes: FuncionesComunes = new FuncionesComunes();
  
    @HostListener('keypress', ['$event']) onKeyPress(e) {
      if (!this.funcionesComunes.validaSoloLetrasCaracteres(String.fromCharCode(e.charCode))) {
        e.preventDefault()
      }
    }
  }

  @Directive({
    selector: '[appValidador][Email]'
  })
  export class ValidadorEmailDirective {
  
    funcionesComunes: FuncionesComunes = new FuncionesComunes();
  
    @HostListener('keypress', ['$event']) onKeyPress(e) {
      if (!this.funcionesComunes.validaEmail(String.fromCharCode(e.charCode))) {
        e.preventDefault()
      }
    }
  }


  @Directive({
    selector: "[appValidador][appNumberGuideMask]"
  })
  export class NumberGuideDirective {
    funcionesComunes: FuncionesComunes = new FuncionesComunes();
  
    @HostListener('keypress', ['$event']) onKeyPress(e) {
      if (!this.funcionesComunes.validaNumerosSignos(String.fromCharCode(e.charCode))) {
        e.preventDefault()
      }
    }
  }

  @Directive({
    selector: '([formControlName], [formControl])[disabledControl]',
  })
  export class DisabledControlDirective {
    @Input() set disabledControl(state: boolean) {
      const action = state ? 'disable' : 'enable'
      if(this.ngControl.control)
        this.ngControl.control[action]();
    }
  
    constructor(private readonly ngControl: NgControl) {}
  }
