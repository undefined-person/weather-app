import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = environment.apiKey
    const modifiedRequest = request.clone({
      url: `${environment.baseUrl}${request.url}`,
      setParams: {
        appid: apiKey
      }
    });

    return next.handle(modifiedRequest);
  }
}
