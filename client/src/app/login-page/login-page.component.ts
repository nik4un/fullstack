import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServices } from '../shared/services/auth.services';
import { User } from '../shared/interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { log } from 'util';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  authSubscribe: Subscription;
  paramsSubscribe: Subscription;

  constructor(private auth: AuthServices,
              private router: Router,
              private  route: ActivatedRoute) { }

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

    this.paramsSubscribe = this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        // Теперь вы можете войти в систему, используя свои данные
      } else if (params['accessDenied']) {
        // Для работы вам необходимо авторизоваться
      }
    });
  }

  ngOnDestroy() {
    // отписываемся от подписок
    if (this.authSubscribe) {
      this.authSubscribe.unsubscribe();
    }
    if (this.paramsSubscribe) {
      this.paramsSubscribe.unsubscribe();
    }
  }

  submit() {
    const user: User  = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.form.disable(); // отключам кнопку отправки формы  на время обработки запроса
    // присваиваем подписку переменной, чтобы при редиректе отписаться и леквидировать утечку памяти
    this.authSubscribe =  this.auth.login(user).subscribe(
      () => {
        // редирект на нужную страницу при успешном логине
        console.log('Redirect');
        // this.router.navigate(['/overview']);
      },
      error => {
        console.warn(error);
        this.form.enable(); // включаем кнопку отправки формы при ошибке запроса
      }
    );
  }
}
