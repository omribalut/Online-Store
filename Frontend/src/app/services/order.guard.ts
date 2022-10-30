import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import store from '../redux/store';
import { NotifyService } from './notify.service';

// ng g guard services/auth

@Injectable({
    providedIn: 'root'
})
export class OrderGuard implements CanActivate {

    public constructor(private notify: NotifyService, private router: Router) {}

    // This function invoked whenever user tries to enter a route required to be logged-in
    // This function should return true if the user is actually logged in, or false if he isn't logged in:
    canActivate(): boolean {

        if(store.getState().cartDetailsState.cartDetails.length > 0) {
            return true;
        }

        this.notify.error("Your cart is empty");
        return false;
    }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     return true;
    // }

}