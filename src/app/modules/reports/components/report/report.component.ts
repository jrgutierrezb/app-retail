import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/core/class/Alert';
import { IAssetRequest } from 'src/app/modules/assetsManagement/interfaces/IAssetRequest';
import { ICatalog } from 'src/app/modules/assetsManagement/interfaces/ICatalog';
import { IProcessState } from 'src/app/modules/assetsManagement/interfaces/IProcessState';
import { AssetRequestService } from 'src/app/modules/assetsManagement/services/asset-request.service';
import { CatalogService } from 'src/app/modules/assetsManagement/services/catalog-service';
import { ProcessStateService } from 'src/app/modules/assetsManagement/services/process-state.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  data:IAssetRequest[];
  alert = new Alert();
  user = this.storageService.getCurrentUser();
  public types: ICatalog[];
    
  months = ['January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'];
  
  constructor(
    private storageService: StorageService, 
    private catalogService: CatalogService,){
      this.data = [];
      this.types = [];
      this.getTypes('TPS');
    }
  
   ngOnInit(): void {
  }

  getTypes(code: string) {
    this.catalogService.Catalogs(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.types = respuesta.data;
        this.types.unshift({
          id: null,
          name: 'Todos',
          code: 'Todos',
          description: 'Todos'
        })
      }
      else {
        this.types =  [];
      }
    }, (error) => {
      this.types =  [];
    });
    
  }

}
