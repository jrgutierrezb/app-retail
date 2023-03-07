import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import { Subject } from 'rxjs';
import { IMenuNavData } from 'src/app/core/interfaces/menu.interface';

import { environment } from '../../../environments/environment';
import { Session } from '../../core/class/Session';
import { User } from '../../core/class/User';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    end_point = environment.baseUrl;

    private currentSession: any ;
    public isLoading= new Subject<boolean>();

    constructor(private router: Router) {

        this.currentSession = this.loadSessionData();
    }

    setCurrentSession(session: Session): void {
        this.currentSession = session;
        localStorage.setItem('currentUser', JSON.stringify(session));
    }

    setCurrentUser(user: User): void {
        const session: Session = this.getCurrentSession();
        session.user = user;
        this.setCurrentSession(session);
    }

    loadSessionData(): any {
        let sessionStr = null;
        try {
        const data = localStorage.getItem('currentUser') || '';
        sessionStr = JSON.parse(data);
        if (!sessionStr || sessionStr == '') {
            this.logout();
            return;
        }
        } catch (e) {
        this.logout();
        // throw "Error al cargar la sesión";
        }
        return (sessionStr) ? <Session>sessionStr : null;
    }

    getCurrentSession(): Session  {
        return this.currentSession;
    }

    removeCurrentSession(): void {
        this.currentSession = null;
        localStorage.clear();
    }

    getCurrentUser(): User | null {
        const session: Session | null = this.getCurrentSession();
        return (session && session.user) ? session.user : null;
    }

    isAuthenticated() {
        return (this.getCurrentToken() != null) ? true : false;
    }

    getCurrentToken(): string | null {
        const session = this.getCurrentSession();
        return (session && session.token) ? session.token : null;
    }

    getCurrentMenu() : IMenuNavData[] {
        const session: Session | null = this.getCurrentSession();
        return (session && session.menus) ? session.menus : [];
    }

    logout(): void {
        if( this.router.url != '/login')
        {
            this.removeCurrentSession();
            this.router.navigate(['/login']);
        }
    }
  
}