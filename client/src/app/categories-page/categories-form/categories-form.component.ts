import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CategoriesService } from '../../shared/services/categories.service';
import { MaterialService } from '../../shared/classes/material.service';
import { Category, Question } from '../../shared/interfaces';
import { ConfirmService } from '../../shared/components/confirm/confirm.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('fileInput') inputRef: ElementRef;
  form: FormGroup;
  isNew = true;
  image: File;
  imagePreview = '';
  category: Category;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private confirmService: ConfirmService,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl(null, [Validators.required])
    });

    this.form.disable();
    this.route.params
      .pipe(switchMap((params: Params) => {
        if (params['id']) {
          this.isNew = false;
          return this.categoriesService.getById(params['id']);
        }
        return of(null);
      })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            // метод patchValue меняет данные формы
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInput(); // имитируем реальный ввод текста
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message)
      );
  }

  clickTrigger() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
   this.image = event.target.files[0];

   // получеие превью в виде src из загруженного файла
   const reader = new FileReader();
   reader.onload = () => {
     this.imagePreview = String(reader.result);
   };
   reader.readAsDataURL(this.image);
  }

  deleteCategory() {
    // Запрос на подтверждение
    const question: Question = {
      crux: `Вы уверены, что хотите удалить категорию «${this.category.name}»?`,
      positive: 'Уверен, удалить',
      negative: 'Нет, не удалять'
    };
    this.confirmService.confirmThis(question,
      () => {
        this.categoriesService.delete(this.category._id)
          .subscribe(
            response => MaterialService.toast(response.message),
            error => MaterialService.toast(error.error.message),
            () => this.router.navigate(['/categories'])
          );
      },
      () => null);

    /*const decision =
      window.confirm(`Вы уверены, что хотите удалить категорию ${this.category.name}`);

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        );
    }*/
  }

  submit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(
        this.category._id,
        this.form.value.name,
        this.image);
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Данные успешно сохранены');
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
