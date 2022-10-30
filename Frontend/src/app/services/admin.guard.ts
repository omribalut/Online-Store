import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import store from '../redux/store';
import { NotifyService } from './notify.service';

// ng g guard services/auth

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    public constructor(private notify: NotifyService, private router: Router) {}

    canActivate(): boolean {

        if(store.getState().authState.token && store.getState().authState.user.role === 'Admin') {
            return true;
        }

        this.notify.error("You are not Authorized");
        this.router.navigateByUrl("/welcome");
        return false;
    }


}