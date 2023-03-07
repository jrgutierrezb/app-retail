export class FuncionesComunes {
      
  validaNumerosCaracteres(valor) {
    const exp = /^[a-zA-Z0-9]*$/;
    return exp.test(valor)
  }

  validaNumerosSignos(valor) {
    const exp = /^[0-9\-]*$/;
    return exp.test(valor)
  }
  
  validaSoloCaracteres(valor) {
    const exp = /^[a-zA-Z ]*$/;
    return exp.test(valor)
  }
  
  //en proceso
  validaSoloLetrasCaracteres(valor) {
    const exp = /^[a-zA-Z\w\W ]+$/;
    return exp.test(valor)
  }
  
  validaSoloNumeros(valor) {
    const exp = /^[0-9]*$/;
    return exp.test(valor)
  }

  validaEmail(valor){
    const exp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return exp.test(valor)
  }

  validarIdentificacion(cedula) {
    if(cedula.length !== 10) {
      return 2;
    } else {
      let tercerDigito = parseInt(cedula.substring(2, 3));
      if (tercerDigito < 6) {
        // El ultimo digito se lo considera dígito verificador
        let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];       
        let verificador = parseInt(cedula.substring(9, 10));
        let suma:number = 0;
        let digito:number = 0;
        for (let i = 0; i < (cedula.length - 1); i++) {
            digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];      
            suma += ((parseInt((digito % 10)+'') + (parseInt((digito / 10)+''))));
        //      console.log(suma+" suma"+coefValCedula[i]); 
        }
        suma= Math.round(suma);
        if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10)== verificador)) {
          return 0;
        } else if ((10 - (Math.round(suma % 10))) == verificador) {
            return 0;
        } else {
          return 2;
        }
      } else {
        return 2;
      }
    }
    
  }

  validadorCedula(cedula) {
    return this.validarIdentificacion(cedula);
  }
}