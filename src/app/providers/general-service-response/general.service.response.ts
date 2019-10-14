import { AppConstants } from '../../constants/app-constants.constans';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loggerProvider } from '../logger/logger.provider';

/*
  Generated class for the GeneralServiceResponseProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeneralServiceResponseProvider {
    private idLog: string = 'RESPONSE-PROV';

    constructor(
        public logger: loggerProvider,
        public constants: AppConstants
    ) {

    }

    public extractData(res: Response | any) {
        let body;
        if (res.bytesSent) {
            body = JSON.parse(res.response);
        } else {
            body = res;
        }
        return body || {};
    }

    public handleError(error: Response | any) {
        /**
         * partial error api
         * { statusCode: 400, customMessage: 'RUT ingresado ya existe.', type: 'Error de Registro' }
         */
        this.logger.log(this.idLog, 'handleError', error);
        let errMsg: { statusCode: number, message: string, error: string };
        if (error.error) {
            if (error.error.message && error.error.statusCode && error.error.error) {
                errMsg = {
                    statusCode: error.error.statusCode,
                    message: error.error.message,
                    error: error.error.error
                };
            }
            else {
                if (error.status == 0) {
                    errMsg = {
                        statusCode: 0,
                        message: 'Error en Solicitud',
                        error: 'Error'
                    };
                } else {
                    errMsg = {
                        statusCode: error.status ? error.status : (error.statusCode ? error.statusCode : '400'),
                        message: error.message ? error.message : (error.customMessage ? error.customMessage : 'Error en Solicitud'),
                        error: error.statusText ? error.statusText : (error.type ? error.type : 'Error')
                    };
                }

            }
        } else {
            if (error.body) {
                try {
                    error = JSON.parse(error.body);
                    this.logger.log(this.idLog, 'Func[handleError try', error);
                    errMsg = {
                        statusCode: error.status ? error.status : (error.statusCode ? error.statusCode : '400'),
                        message: error.message ? error.message : (error.customMessage ? error.customMessage : 'Error en Solicitud'),
                        error: error.statusText ? error.statusText : (error.type ? error.type : 'Error')
                    };
                } catch (error) {
                    this.logger.log(this.idLog, 'Func[handleError catch', error);
                    errMsg = {
                        statusCode: error.status ? error.status : (error.statusCode ? error.statusCode : '400'),
                        message: error.message ? error.message : (error.customMessage ? error.customMessage : 'Error en Solicitud'),
                        error: error.statusText ? error.statusText : (error.type ? error.type : 'Error')
                    };
                }
            } else {
                errMsg = {
                    statusCode: error.status ? error.status : (error.statusCode ? error.statusCode : '400'),
                    message: error.message ? error.message : (error.customMessage ? error.customMessage : 'Error en Solicitud'),
                    error: error.statusText ? error.statusText : (error.type ? error.type : 'Error')
                };
            }
        }
        this.logger.log(this.idLog, 'handleError', errMsg);
        if (errMsg.statusCode == 500 || errMsg.statusCode == 0 || errMsg.message == 'Timeout has occurred') {
            this.logger.log(this.idLog, 'service error constants', this.constants);
            let msj = this.constants.MESSAGES.ERROR.REQUEST;
            errMsg.message = msj;
        }

        return Observable.throw(errMsg);
    }

}
