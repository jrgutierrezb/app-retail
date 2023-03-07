import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Alert } from '../../class/Alert';
import { User } from '../../class/User';
import { SecurityService } from '../../services/security.service';
import { IMenuNavData } from '../../interfaces/menu.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnInit {

  public navItems!: INavData[];
  public menuNavItems!: IMenuNavData[];
  user!: User | null;
  alert = new Alert();

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private securityService: SecurityService,
    private storageService: StorageService
  ) {}
  ngOnInit(): void {
    this.menuNavItems = this.storageService.getCurrentMenu();
    this.navItems = this.menuNavItems;
    this.user = this.storageService.getCurrentUser();
    if(this.navItems.length == 0) {
      this.securityService.Menu((this.user && this.user.profileid) ? this.user.profileid : null)
      .subscribe(
        (respuesta) => {
          if(!respuesta.error) {
            const session = this.storageService.getCurrentSession();
            session.menus = respuesta.data;
            this.storageService.setCurrentSession(session);
            this.menuNavItems = this.storageService.getCurrentMenu();
            this.navItems = this.menuNavItems;
            
          }
        }, (error) => {
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
        }
      )
    }
  }
}
