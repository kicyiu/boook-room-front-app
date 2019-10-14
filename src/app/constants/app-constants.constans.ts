import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants {

   MSG_MAX_LENGHT = 150;
   MESSAGES: {
      SUCCESS: {
         SAVE: 'Tus Datos Fueron registrados con Exito'
      },
      ERROR: {
         REQUEST: 'Ocurrio un Error al hacer tu solicitud'
      }
   };
}
