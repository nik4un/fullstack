import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ModalInstance } from '../../interfaces';
import { MaterialService } from '../../classes/material.service';
import { ConfirmService } from './confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit, AfterViewInit, OnDestroy {

  message: any;
  confirmSubscribe: Subscription;

  constructor(private confirmService: ConfirmService) { }

  @ViewChild('modal') modalRef: ElementRef;
  modal: ModalInstance;

  ngOnInit() {
    // this function waits for a message from alert service,
    // it gets triggered when we call this from any other component
    this.confirmSubscribe = this.confirmService.getMessage().subscribe( message => {
      this. message =  message;
      this.modal.open();
    });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.confirmSubscribe) {
      this.confirmSubscribe.unsubscribe();
    }
  }

  onConfirm() {
    this.modal.close();
    this.message.yesFn();
  }

  onCancel() {
    this.modal.close();
    this.message.noFn();
  }

}
