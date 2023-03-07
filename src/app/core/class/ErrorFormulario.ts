import { FormGroup, ValidationErrors } from "@angular/forms";

export class ErrorFormulario {
    /// --------------------------------------------------------------------------------
    /// <summary>
    /// CONSULTAR TIPO DE AUTORIZACIONES CUANDO SE CAMBIA DE SERVICIO
    /// </summary>
    /// <param name="p_form"> OBJETO FORMULARIO A VALIDAR </param>
    /// <param name="p_control"> NOMBRE DEL CONTROL A VALIDAR </param>
    /// <returns>
    /// </returns>
    /// --------------------------------------------------------------------------------
    ObtieneMensajeError(p_form: FormGroup, key: string) {
        let mensaje = '';

        if (p_form.get(key).hasError('identificacion')) {
            let error = p_form.get(key).getError('identificacion');
            switch (error) {
                case 1:
                    mensaje = 'Debe ingresar un Número de Cédula válido';
                    break;
                case 2:
                    mensaje = 'Número de Cédula Incorrecto';
                    break;
                case 3:
                    mensaje = 'Debe ingresar un Número de Ruc válido';
                    break;
                default:
                    mensaje = 'Identificación Incorrecta';
                    break;
            }
            return mensaje;
        }


        const error: ValidationErrors = p_form.get(key).errors;
        if (error) {
            let text;
            let k = Object.keys(error).shift()
            switch (k) {
                case 'required': text = `Campo requerido`; break;
                case 'pattern': text = `${key} has wrong pattern!`; break;
                case 'email': text = `Correo tiene un formato incorrecto!`; break;
                case 'minlength': text = `Longitud incorrecta! longitud minima: ${error[k].requiredLength}`; break;
                case 'maxlength': text = `Longitud incorrecta! longitud maxima: ${error[k].requiredLength}`; break;
                case 'soloNumeros': text = 'Solo son permitidos numeros'; break;
                case 'areEqual': text = `${key} must be equal!`; break;
                default: text = `${key}: ${error[k]}`; break;
            }
            mensaje = text;
        }
        return mensaje;
    }
}