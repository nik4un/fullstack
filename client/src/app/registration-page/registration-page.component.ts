import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  authSubscribe: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private  route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(
        null,
        [Validators.required, Validators.email]),
      'password': new FormControl(
        null,
        [Validators.required, Validators.minLength(6)]
      )
    });
  }

  ngOnDestroy() {
    // отписываемся от подписок
    if (this.authSubscribe) {
      this.authSubscribe.unsubscribe();
    }
  }

  submit() {
    const user: User  = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.form.disable(); // отключам кнопку отправки формы  на время обработки запроса
    // присваиваем подписку переменной, чтобы при редиректе отписаться и леквидировать утечку памяти
    this.authSubscribe =  this.auth.registration(user).subscribe(
      () => {
        // редирект на нужную страницу при успешном логине
        this.router.navigate(['/login'], {queryParams: {
          registered: true
          }});
        console.log('Registration success');
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable(); // включаем кнопку отправки формы при ошибке запроса
      }
    );
  }
}
