import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { loggerProvider } from '../providers/logger/logger.provider';
import { BaseServices } from '../providers/base-services/base.service.provider';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  private env: any = environment;
  private url: string;
  private idLog: string = 'MEETING-SERVICES';

  public meetingDataSubject = new Subject<void>();
  public meetingData$ = this.meetingDataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private logger: loggerProvider,
    private baseServices: BaseServices
  ) { }


  /* private postServices(url, data): Observable<any> {
    return this.http.post(
      this.env.url + url,
      data,
      {
        headers: { 'authorization': '', 'Content-type': 'application/json'},
      });
  } */


  creatingMeeting(data): Observable<any> {
    this.url = '/api/meetings/create';
    return this.baseServices.postServices(this.url, data);
  }

  getMeetings(request: any = {}): Observable<any> {
    this.url = '/api/meetings/get';
    return this.baseServices.getServices(this.url, request);
  }

  updateMeeting(data): Observable<any> {
    this.url = '/api/meetings/update';
    return this.baseServices.putServices(this.url, data);
  }

  removeMeeting(data): Observable<any> {
    this.url = '/api/meetings/delete';
    return this.baseServices.deleteServices(this.url, data);
  }


}
