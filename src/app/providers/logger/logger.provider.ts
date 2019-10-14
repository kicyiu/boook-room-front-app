/********** Angular **********/
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class loggerProvider {

    private allClassName: Array<string>;
    private env = environment;

    constructor() {
        this.setPages();
        console.log('[loggerProvider]', '[constructor]', this.env);

    }

    setPages() {
        this.allClassName = [
            //COMPONENTS

            //INTERCEPTORS

            //PROVIDERS
            'RESPONSE-PROV',

            //SERVICES
            'MEETING-SERVICES',

            //INIT
            'MyApp'
        ];
    }

    log(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A') {
        this.printLog(page, functionName, data, 'LOG');
    }

    warn(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A') {
        this.printLog(page, functionName, data, 'WARN');
    }

    info(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A') {
        this.printLog(page, functionName, data, 'INFO');
    }

    error(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A') {
        this.printLog(page, functionName, data, 'ERROR');
    }

    printLog(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A', type: string = 'LOG') {
        let data2: any;
        if (this.env.debug) {
            if (this.allClassName.length > 0) {
                if (this.isPresent(page)) {
                    try {
                        data2 = data;
                    } catch (err) {
                        console.log('logger trycatch error: ', err)
                    }
                    if (type == 'LOG') {
                        console.log('Page[', page, ']', ' --Func[', functionName, '] -->[', data2, ']');
                    }
                    if (type == 'INFO') {
                        console.log('Page[', page, ']', ' --Func[', functionName, '] -->[', data2, ']');
                    }
                    if (type == 'WARN') {
                        console.warn('Page[', page, ']', ' --Func[', functionName, '] -->[', data2, ']');
                    }
                    if (type == 'ERROR') {
                        console.error('Page[', page, ']', ' --Func[', functionName, '] -->[', data2, ']');
                    }
                }
            }
        }
    }

    isPresent(page: string): boolean {
        let response = false;
        let res = this.allClassName.filter((item) => { return item == page });
        if (res.length > 0) {
            response = true;
        }
        return response;
    }

}
