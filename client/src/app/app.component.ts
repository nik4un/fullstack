import { Component, OnInit } from '@angular/core';
import { AuthServices } from './shared/services/auth.services';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthServices) {}

  ngOnInit(): void {
    const potentialToken = localStorage.getItem('auth-token');
    if (potentialToken !== null) {
      this.auth.setToken(potentialToken);
    }
  }
}
