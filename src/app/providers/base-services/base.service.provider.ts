/**
 * Autor: Alberto Tsang
 * Ultima Act: 13-12-2018 
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralServiceResponseProvider } from '../general-service-response/general.service.response';


@Injectable()
export class BaseServices {
    private env: any = environment;
    constructor(
        public http: HttpClient,
        public servicesResponseProvider: GeneralServiceResponseProvider
    ) {

    }

    public getServices(url, request): Observable<{}> {
        const params = new HttpParams({ fromObject: request });
        const header = new HttpHeaders({
            'Content-type': 'application/json'
        });
        return this.http
            .get(this.env.url + url, { headers: header })
            .pipe(
                map((res) => this.servicesResponseProvider.extractData(res)),
                catchError((res) => this.servicesResponseProvider.handleError(res))
            );
    }

    postServices(url, request, baseHeader: any = {}, isFormData: boolean = false, useUrl: boolean = false): Observable<{}> {
        let params: any;
        const header = new HttpHeaders(baseHeader);

        if (isFormData) {
            const formData = new FormData();
            Object.keys(request).forEach(key => {
                formData.append(key, request[key]);
            });
            params = formData;
        } else {
            params = new HttpParams({ fromObject: request });
        }
        return this.http
            .post(useUrl ? url : this.env.url + url, params, { headers: header })
            .pipe(
                map((res) => this.servicesResponseProvider.extractData(res)),
                catchError((res) => this.servicesResponseProvider.handleError(res))
            );
    }

    // tslint:disable-next-line: max-line-length
    public putServices(url, request, baseHeader: any = {}, headerOptions: Array<{ parametro: string, valor: string }> = [], retryParam: number = 0): Observable<{}> {
        let params = new HttpParams({ fromObject: request });
        url = `${url}/${request.id}`;
        if (baseHeader['Content-Type'] === 'application/json') {
            params = request;
        }
        const header = new HttpHeaders(baseHeader);
        if (headerOptions.length > 0) {
            headerOptions.forEach((item) => {
                header.append(item.parametro, item.valor);
            });
        }
        if (retryParam > 0) {
            return this.http
                .put(this.env.url + url, params, { headers: header })
                .pipe(
                    retry(retryParam),
                    map((res) => this.servicesResponseProvider.extractData(res)),
                    catchError((res) => this.servicesResponseProvider.handleError(res))
                );
        } else {
            return this.http
                .put(this.env.url + url, params, { headers: header })
                .pipe(
                    map((res) => this.servicesResponseProvider.extractData(res)),
                    catchError((res) => this.servicesResponseProvider.handleError(res))
                );
        }

    }

    public deleteServices(url, request, baseHeader: any = {}, ): Observable<{}> {
        const params = new HttpParams({ fromObject: request });
        const header = new HttpHeaders(baseHeader);
        url = `${url}/${request.id}`;
        return this.http
            .delete(this.env.url + url, { headers: header, params })
            .pipe(
                map((res) => this.servicesResponseProvider.extractData(res)),
                catchError((res) => this.servicesResponseProvider.handleError(res))
            );
    }

}
