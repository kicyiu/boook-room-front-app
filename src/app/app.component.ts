import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';



import { MeetingService } from './services/meeting.service';
import { NgxModalComponent } from './components/ngx-modal/ngx-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-prueba-mapcity';

  @ViewChild('myButton', {static: false}) myButton: ElementRef<HTMLElement>;

  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin, listPlugin]; // important!
  meetingData: any;

  calendarEvents: EventInput[] = [];
  /* calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() }
  ]; */

  modalRef: BsModalRef;

  constructor(
    // tslint:disable-next-line: variable-name
    private _meetingService: MeetingService,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) {

    this.meetingData = {};

  }

  ngOnInit() {
    this.getCalendarEvents();

    this._meetingService.successData$.subscribe((data) => {
      this.processSuccessData(data);
    });
  }

  getCalendarEvents() {
    this._meetingService.getMeetings().subscribe((res) => {
      console.log('getCalendarEvents: ', res);
      if (res.statusCode === 200) {
        res.data.forEach(event => {
          const eventObj = {
            id: event.id,
            title: event.title,
            start: new Date(`${event.meeting_date} ${event.init_time}`),
            end: new Date(`${event.meeting_date} ${event.end_time}`),
            description: event.description
          };
          this.calendarEvents = this.calendarEvents.concat(eventObj);
        });
      }

      console.log('calendarEvents: ', this.calendarEvents);
    }, (err) => {

    });
  }

  handleDateClick(arg, template: TemplateRef<any>) {
    console.log('handleDateClick: ', arg);
    this.openNgxModal(false);
    if ((arg.date.getDay() !== 0) && (arg.date.getDay() !== 6)) {
      this.meetingData = {
        meetingDate: this.datePipe.transform(arg.date, 'yyyy-MM-dd'),
        startHour: 12,
        startMinute: 0,
        endHour: 13,
        endMinute: 0
      };

      this._meetingService.meetingDataSubject.next(this.meetingData);

      //this.openEventModal();
    }
  }

  openEventModal() {
    const el: HTMLElement = this.myButton.nativeElement;
    el.click();
  }

  openNgxModal(updateEvent: boolean) {
    const initialState = {
      updateEvent
    };
    this.modalRef = this.modalService.show(NgxModalComponent, {initialState});
  }

  handleEventClick(arg) {
    console.log('handleEventClick ', arg);
    this.openNgxModal(true);
    this.meetingData = {
      id: parseInt(arg.event._def.publicId, 10),
      title: arg.event._def.title,
      meetingDate: this.datePipe.transform(arg.event._instance.range.start, 'yyyy-MM-dd'),
      // tslint:disable-next-line: max-line-length
      startHour: parseInt(this.datePipe.transform(arg.event._instance.range.start, 'H'), 10) + arg.event._instance.range.start.getTimezoneOffset() / 60,
      startMinute: this.datePipe.transform(arg.event._instance.range.start, 'm'),
      // tslint:disable-next-line: max-line-length
      endHour: parseInt(this.datePipe.transform(arg.event._instance.range.end, 'H'), 10) + arg.event._instance.range.end.getTimezoneOffset() / 60,
      endMinute: this.datePipe.transform(arg.event._instance.range.end, 'm'),
      description: arg.event._def.extendedProps ? arg.event._def.extendedProps.description : '',
      updateEvent: true
    };

    this._meetingService.meetingDataSubject.next(this.meetingData);

    //this.openEventModal();
  }

  processSuccessData(event) {
    console.log('processSuccessData', event);
    switch (event.action) {
      case 'create': {
        const eventObj = {
          id: event.id,
          title: event.title,
          start: new Date(`${event.meeting_date} ${event.init_time}`),
          end: new Date(`${event.meeting_date} ${event.end_time}`),
          description: event.description
        };
        this.calendarEvents = this.calendarEvents.concat(eventObj);
        break;
      }
      case 'update': {
        let auxEventList: any = JSON.stringify(this.calendarEvents);
        auxEventList = JSON.parse(auxEventList);
        const eventList = [];
        auxEventList.forEach(e => {
          if (e.id === event.id) {
            e.title = event.title;
            e.start = new Date(`${event.meeting_date} ${event.init_time}`);
            e.end = new Date(`${event.meeting_date} ${event.end_time}`);
            e.description = event.description;
          }
          eventList.push(e);
        });
        this.calendarEvents = eventList;
        break;
      }
      case 'remove': {
        let auxEventList: any = JSON.stringify(this.calendarEvents);
        auxEventList = JSON.parse(auxEventList);
        const eventList = [];
        auxEventList.forEach((e, index) => {
          if (e.id !== parseInt(event.meetingId, 10)) {
            eventList.push(e);
          }
        });

        console.log('eventList: ', eventList);
        this.calendarEvents = eventList;
        break;
      }
    }
  }

}
