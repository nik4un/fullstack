import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { PositionService } from '../../../shared/services/position.service';
import { Position, Question } from '../../../shared/interfaces';
import { MaterialService, MaterialInstance } from '../../../shared/classes/material.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmService } from '../../../shared/components/confirm/confirm.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  @ViewChild('confirm') confirmRef: ElementRef;

  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId: string = null;

  constructor(private positionService: PositionService,
              private confirmService: ConfirmService) { }

  private complete() {
    this.modal.close();
    this.form.reset({ name: '', cost: 1 });
    this.form.enable();
  }

  ngOnInit() {
    this.loading = true;

    this.form = new FormGroup({
      'name': new FormControl(null,
        [Validators.required]),
      'cost': new FormControl(1,
        [Validators.required, Validators.min(1)])
    });


    this.positionService.fetch(this.categoryId)
      .subscribe(positions => {
        this.positions = positions;
        this.loading = false;
      });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
    MaterialService.updateTextInput();
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    MaterialService.updateTextInput();
    this.modal.open();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: '',
      cost: 1
    });
    MaterialService.updateTextInput();
    this.modal.open();
  }

  onDeletePosition(event: Event, position: Position) {
    // остонавливаем распространение события
    event.stopPropagation();

    // Запрос на подтверждение
    const question: Question = {
      crux: `Удалить позицию «${position.name}»?`,
      positive: 'Да, удалить',
      negative: 'Нет, не удалять'
    };
    this.confirmService.confirmThis(question,
      () => {
        this.positionService.delete(position).subscribe(
          (res) => {
            MaterialService.toast(res.message);
            this.positions = this.positions.filter(p => p._id !== position._id);
          },
          (error) => MaterialService.toast(error.error.message),
          () => {
            this.complete();
          }
        );
    },
      () => null);
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionService.update(newPosition).subscribe(
        (position) => {
          // заменяем элемент в массиве отображения позиций
          const idx = this.positions.findIndex((elem) => elem._id === this.positionId);
          this.positions[idx] = position;

          MaterialService.toast('Позиция успешно изменена');
          this.modal.close();
        },
        (e) => MaterialService.toast(e.error.message),
        () => this.complete()
      );
    } else {
      this.positionService.create(newPosition).subscribe(
        (position) => {
          MaterialService.toast('Позиция успешно добавлена');
          this.positions.push(position);
          this.modal.close();
        },
        (e) => MaterialService.toast(e.error.message),
        () => this.complete()
      );
    }
  }
}
