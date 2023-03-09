import { Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { User } from 'src/app/core/class/User';
import { Alert } from 'src/app/core/class/Alert';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { IAssetRequest } from 'src/app/modules/assetsManagement/interfaces/IAssetRequest';
import { AssetRequestService } from 'src/app/modules/assetsManagement/services/asset-request.service';
import { ReportsService } from '../../services/reports-services';
import { IAgency } from 'src/app/modules/assetsManagement/interfaces/IAgency';
import { IWorkDepartment } from 'src/app/modules/assetsManagement/interfaces/IWorkDepartment';
import { AgencyService } from 'src/app/modules/assetsManagement/services/agency.service';
import { WorkDepartmentService } from 'src/app/modules/assetsManagement/services/work-department.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.css']
})
export class GeneralReportComponent implements OnInit {
  @ViewChild('table') table!: TableComponent;

  agencies: IAgency[] = [];
  workdepartments: IWorkDepartment[] = [];


  consultando: boolean = false;
  exportando: boolean = false;
  
  form!: FormGroup;
  
  data:IAssetRequest[];

  alert = new Alert();

  title: string = 'Listado de Solicitudes';

  headers: IHeaders[] = [
    {
      columnName: 'Fecha',
      field: 'datein',
      type: 'date'
    },
    {
      columnName: 'Código',
      field: 'productcode',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Producto',
      field: 'productname',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Años de garantia',
      field: 'yearwarranty',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Factura',
      field: 'state',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Agencia',
      field: 'agencyname',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Departamento',
      field: 'departmentname',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Estado',
      field: 'statename',
      type: 'string'
    }
  ]

  currentUserId: any;

  constructor(
    private reportsService: ReportsService,
    private agencyService: AgencyService,
    private workDepartmentService: WorkDepartmentService
  ) {
    this.data = [];

    let currentdate = new Date();
    let currentDateEnd = new Date();
    currentDateEnd.setMonth(currentDateEnd.getMonth() - 1);
    this.form = new FormGroup({
      datefrom: new FormControl(currentDateEnd.getFullYear() + "-" + (currentDateEnd.getMonth() + 1).toString().padStart(2, '0') + "-" + currentDateEnd.getDate().toString().padStart(2, '0'), Validators.required),
      dateend: new FormControl(  currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0') + "-" + currentdate.getDate().toString().padStart(2, '0'), Validators.required),
      agencyid: new FormControl(null),
      workdepartmentid: new FormControl(null)
    });
   }

  ngOnInit() {
    this.consultar();
    this.getAgencies();
    this.getWorkDepartments();
  }

  refreshData() {
    this.consultar();
  }

  getAgencies() {
    this.agencyService.Agencies().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.agencies = respuesta.data;
        this.agencies.unshift({
          id: null,
          name: 'Todos',
          code: 'Todos',
          description: 'Todos'
        });
      }
      else {
        this.agencies = [];
      }
    }, (error) => {
      this.agencies = [];
    });
  }

  getWorkDepartments() {
    this.workDepartmentService.WorkDeparments().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.workdepartments = respuesta.data;
        this.workdepartments.unshift({
          id: null,
          name: 'Todos',
          code: 'Todos',
          description: 'Todos'
        });
      }
      else {
        this.workdepartments = [];
      }
    }, (error) => {
      this.workdepartments = [];
    });
  }

  consultar() {
    this.consultando = true;
    let endDate = new Date(this.form.get('dateend').value)
    endDate.setDate(endDate.getDate() + 1);
    let params = {
      "p_datefrom": new Date(this.form.get('datefrom').value).toISOString(),
      "p_dateend": endDate,
      "p_agencyid": this.form.get('agencyid').value ? Number.parseInt(this.form.get('agencyid').value)  : this.form.get('agencyid').value,
      "p_workpedartmentid": this.form.get('workdepartmentid').value ? Number.parseInt(this.form.get('workdepartmentid').value)  : this.form.get('workdepartmentid').value
    };
    this.reportsService.GeneralReport(params).subscribe((respuesta) => {
      this.consultando = false;
      if(!respuesta.error) {
        this.data = respuesta.data;
        setTimeout(() => {
          this.table.viewData();
        }, 500);
      }
    }, (error) => {
      this.consultando = false;
      this.alert.sweetAlert('Confirmación', 
        'Error', 
        'error',
        true,
        false,
        'OK'
      ).then((result) => {
              console.log(result);
      }).catch((error) => {
              console.log(error);
      });
    });
  }

  exportar() {
    this.exportando = true;
    this.exportAsExcelFile(this.data, 'reporte_general');
  }

  private exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    this.exportando = false;
  }
}
