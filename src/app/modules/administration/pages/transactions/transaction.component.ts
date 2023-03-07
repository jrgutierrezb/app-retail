import { Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { Alert } from 'src/app/core/class/Alert';
import { ITransaction } from '../../interfaces/ITransaction.interface';
import { TransactionService } from '../../services/transaction.service';
import { CreateOrEditTransactionComponent } from '../../components/create-or-edit-transaction/create-or-edit-transaction.component';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  @ViewChild('createOrEditTransaction')
  createOrEditTransaction!: CreateOrEditTransactionComponent;
  @ViewChild('table') table!: TableComponent;

  alert = new Alert();

  headers: IHeaders[] = [
    {
      columnName: 'Nombre',
      field: 'name',
      type: 'string'
    },
    {
      columnName: 'Descripcion',
      field: 'description',
      type: 'string'
    },
    {
      columnName: 'Modulo',
      field: 'namemodule',
      type: 'string'
    },
    {
      columnName: 'Ruta',
      field: 'url',
      type: 'string'
    }
  ]

  data:ITransaction[];

  eventsTable: IEventTable[] = [
    {
      permiso: 'WRITE',
      icon: 'cil-pencil',
      color: 'info',
      description: 'Editar'
    },
    {
      permiso: 'DELETE',
      icon: 'cil-trash',
      color: 'danger',
      description: 'Eliminar'
    }
  ];

  constructor(
    private transactionService: TransactionService
  ) {
    this.data = [];
   }

  ngOnInit(): void {
    this.consultar();
  }

  consultar() {
    this.transactionService.Transactions().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.data = respuesta.data;
        setTimeout(() => {
          this.table.viewData();
        }, 500);
      }
    }, (error) => {
      this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK'
      ).then((result) => {
              console.log(result);
      }).catch((error) => {
              console.log(error);
      });
    });
  }

  /** fucntion call modal */
  toggleLiveDemo(id?: number) {
    this.createOrEditTransaction.toggleLiveDemo(id);
  }

  EditOrDelete(data: any) {
    switch(data.permiso) {
      case 'WRITE': {
        this.toggleLiveDemo(data.item.id);
        break;
      }
      case 'DELETE': {
        this.alert.sweetAlert('Esta seguro de eliminar la pantalla?', 'No podrá recuperar la informacón!', 
          'warning', true, true)
        .then((result) => {
          if(result.value) {
            //eliminar
            console.log('ELIMINAR');
          }
        })
        break;
      }
      default:{
        break;
      }
    }
  }
}
