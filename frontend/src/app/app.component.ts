import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';
import { Role, User } from './models/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isPolish: boolean;
  currentUser: User;

  constructor(public authService: AuthService, private _snackBar: MatSnackBar, private translate: TranslateService,
    title: Title) {
      this.isPolish = this.translate.currentLang.includes('pl');
      
      translate.stream("psi.title").subscribe(name =>
        title.setTitle(name)
      );

      this.authService.currentUser.subscribe(
          (currentUser: User)  => {
              this.currentUser = currentUser;
          }
      );
  }
  changeLanguage()
  {
    this.isPolish = !this.isPolish;
    if (this.isPolish) {
      this.translate.use('pl');
    }
    else {
      this.translate.use('en');
    }
  }

  logout() {
    this.translate.get("psi.logout-msg").subscribe(msg => {
      this.openSnackBar(msg, "OK", "info");
      this.authService.logout('/login');
    });
  }

  openSnackBar(message: string, action: string, cssClass: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: [cssClass, "snackbar"]
    });
  }
  
}
