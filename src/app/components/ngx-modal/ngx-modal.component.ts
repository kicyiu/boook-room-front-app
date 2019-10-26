import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter,  } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ngx-modal',
  templateUrl: './ngx-modal.component.html',
  styleUrls: ['./ngx-modal.component.css']
})
export class NgxModalComponent implements OnInit {

  //@Output() successData: EventEmitter<number>;

  public successMsg: string;
  public sucessMsgClass: any;

  private meetingDataSubs: Subscription = null;
  public meetingData: any;
  public parentForm: FormGroup = new FormGroup({});
  public updateEvent: boolean;

  constructor(
    // tslint:disable-next-line: variable-name
    public modalRef: BsModalRef,
    private _meetingService: MeetingService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    this.sucessMsgClass = ['alert', 'alert-success', 'animated', 'fadeIn', 'hidden'];
    this.meetingData = {};
    this.buildForm();
    /* this.parentForm.addControl('meetingDate', new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]));
    this.parentForm.addControl('title', new FormControl(''));
    this.parentForm.addControl('startHour', new FormControl(12, [Validators.required, Validators.max(24), Validators.min(1)]));
    this.parentForm.addControl('startMinute', new FormControl(0, [Validators.required, Validators.max(59), Validators.min(0)]));
    this.parentForm.addControl('endHour', new FormControl(13, [Validators.required, Validators.max(24), Validators.min(1)]));
    this.parentForm.addControl('endMinute', new FormControl(0, [Validators.required, Validators.max(59), Validators.min(0)]));
    this.parentForm.addControl('description', new FormControl('')); */
  }

  ngOnInit() {

    this.meetingDataSubs = this._meetingService.meetingData$.subscribe((meetingData) => {
      console.log('subscribe meetingData: ', meetingData);
      this.meetingData = meetingData;
      //this.updateEvent = this.meetingData.updateEvent ? true : false;
      this.setFormControls(meetingData);
    });
  }

  buildForm() {
    this.parentForm = this.formBuilder.group({
      meetingDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      title: [null, [Validators.required]],
      startHour: [12, [Validators.required, Validators.max(21), Validators.min(9)]],
      startMinute: [0, [Validators.required, Validators.max(59), Validators.min(0)]],
      endHour: [12, [Validators.required, Validators.max(21), Validators.min(9)]],
      endMinute: [0, [Validators.required, Validators.max(59), Validators.min(0)]],
      description: [null]
    });
  }

  setFormControls(meetingData) {
    this.parentForm.setControl('meetingDate', new FormControl(meetingData.meetingDate));
    this.parentForm.setControl('title', new FormControl(meetingData.title, [Validators.required]));
    // tslint:disable-next-line: max-line-length
    this.parentForm.setControl('startHour', new FormControl(meetingData.startHour, [Validators.required, Validators.max(21), Validators.min(9)]));
    // tslint:disable-next-line: max-line-length
    this.parentForm.setControl('startMinute', new FormControl(meetingData.startMinute, [Validators.required, Validators.max(59), Validators.min(0)]));
    // tslint:disable-next-line: max-line-length
    this.parentForm.setControl('endHour', new FormControl(meetingData.endHour, [Validators.required, Validators.max(21), Validators.min(9)]));
    // tslint:disable-next-line: max-line-length
    this.parentForm.setControl('endMinute', new FormControl(meetingData.endMinute, [Validators.required, Validators.max(59), Validators.min(0)]));
    this.parentForm.setControl('description', new FormControl(meetingData.description));
  }

  closeModalProcess() {
    console.log('closeModalProcess');
    this.successMsg = '';
    this.modalRef.hide();
  }

  removeEvent() {
    console.log('removeEvent');
    const data = { id: this.meetingData.id };
    this._meetingService.removeMeeting(data).subscribe( (resp) => {
      /* this.successMsg = "Mensajes actualizados exitosamente";
      this.sucessMsgClass = ['alert', 'alert-success', 'animated', 'fadeIn', 'hidden'];
      setTimeout(() =>  {
        this.dismmissMessage();
      }, 5000) */
      console.log('Reserva eliminada exitosamente');
      if (resp.statusCode === 200) {
        this.showSuccessMessage(resp.message);
        resp.data.action = 'remove';
        this._meetingService.successData$.emit(resp.data);
      }
    }, (err) => {
      /* this.errorMsg = "Hubo un error al actualizar los mensajes" + JSON.stringify(err);
      this.errorMsgClass = ['alert', 'alert-danger', 'animated', 'fadeIn', 'hidden'];

      setTimeout(() =>  {
        this.dismmissMessage();
      }, 5000) */
      console.error('Error al eliminar reserva: ', err);
    });
  }

  createNewEvent(formData: any) {
    this._meetingService.creatingMeeting(formData).subscribe( (resp) => {
      /* this.successMsg = "Mensajes actualizados exitosamente";
      this.sucessMsgClass = ['alert', 'alert-success', 'animated', 'fadeIn', 'hidden'];
      setTimeout(() =>  {
        this.dismmissMessage();
      }, 5000) */

      console.log('Reserva creado exitosamente');
      if (resp.statusCode === 200) {
        this.showSuccessMessage(resp.message);

        resp.data.action = 'create';
        this._meetingService.successData$.emit(resp.data);
      }
    }, (err) => {
      /* this.errorMsg = "Hubo un error al actualizar los mensajes" + JSON.stringify(err);
      this.errorMsgClass = ['alert', 'alert-danger', 'animated', 'fadeIn', 'hidden'];

      setTimeout(() =>  {
        this.dismmissMessage();
      }, 5000) */
      console.error('Error al crear reserva: ', err);
    });
  }

  updateExistingEvent(formData: any) {
    this._meetingService.updateMeeting(formData).subscribe( (resp) => {
      /* this.successMsg = "Mensajes actualizados exitosamente";
      this.sucessMsgClass = ['alert', 'alert-success', 'animated', 'fadeIn', 'hidden'];
      setTimeout(() =>  {
        this.dismmissMessage();
      }, 5000) */

      console.log('Reserva actualizado exitosamente');
      if (resp.statusCode === 200) {
        this.showSuccessMessage(resp.message);
        formData.action = 'update';
        this._meetingService.successData$.emit(formData);
      }
    }, (err) => {
      /* this.errorMsg = "Hubo un error al actualizar los mensajes" + JSON.stringify(err);
      this.errorMsgClass = ['alert', 'alert-danger', 'animated', 'fadeIn', 'hidden'];

      setTimeout(() =>  {
        this.dismmissMessage();
      }, 5000) */
      console.error('Error al actualizar reserva: ', err);
    });
  }

  dismmissMessage() {
    this.sucessMsgClass = ['alert', 'alert-success', 'animated', 'fadeOut', 'hidden'];
    //this.errorMsgClass = ['alert', 'alert-danger', 'animated', 'fadeOut', 'hidden'];
    this.successMsg = '';
    this.closeModalProcess();
  }

  showSuccessMessage(msg: string) {
    this.successMsg = msg;
    this.sucessMsgClass = ['alert', 'alert-success', 'animated', 'fadeIn', 'hidden'];
    setTimeout(() =>  {
      this.dismmissMessage();
    }, 5000);
  }

  onSubmit() {
    console.log('onSubmit data: ', this.parentForm);

    const formData: any = {
      title: this.parentForm.value.title,
      meeting_date: this.parentForm.value.meetingDate,
      init_time: `${this.parentForm.value.startHour}:${this.parentForm.value.startMinute}`,
      end_time: `${this.parentForm.value.endHour}:${this.parentForm.value.endMinute}`,
      description: this.parentForm.value.description
    };

    if (!this.updateEvent) {
      this.createNewEvent(formData);
    } else {
      formData.id = this.meetingData.id;
      this.updateExistingEvent(formData);
    }
  }


}
