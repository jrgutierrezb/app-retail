
import swal from 'sweetalert2';

type icons = 'success'|'error'|'warning'|'info'|'question';

export class Alert {

    async sweetAlert(title: string, text: string, icon: icons, 
        showConfirmButton: boolean = true, showCancelButton: boolean = false, 
        confirmButtonText: string = 'Ok', cancelButtonText: string = 'Cancel', timer?: number) {
    
        return swal.fire({
          title: title,
          text: text,
          icon: icon,
          showConfirmButton: showConfirmButton,
          showCancelButton: showCancelButton,
          confirmButtonText: confirmButtonText,
          cancelButtonText: cancelButtonText,
          timer: timer
        });
      }

   async sweetAlertWithInput(title: string, text: string, icon: icons, 
    showConfirmButton: boolean = true, showCancelButton: boolean = false, 
    confirmButtonText: string = 'Ok', cancelButtonText: string = 'Cancel',
    textValidator: string = 'Campo es obligatorio', timer?: number,
    ) {
      return swal.fire({
        title: title,
        text: text,
        input: 'text',
        icon: icon,
        showConfirmButton: showConfirmButton,
        showCancelButton: showCancelButton,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        timer: timer,
        inputValidator: (observation) => {
          if(!observation) {
            return textValidator;
          }
          else {
            return undefined;
          }
          
        }
      });
   }   
}