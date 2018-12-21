import { Injectable,Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector:Injector) { }
  intercept(req,next){
    var authService = this.injector.get(AuthService)
    var tokenizedReq = req.clone({
      setHeaders : {
        Authorization : `Bearer ${authService.getToken()}`
      }
    })
    return next.handle(tokenizedReq)
  }

}
