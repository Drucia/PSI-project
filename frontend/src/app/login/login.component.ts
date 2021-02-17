import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { Role } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  RoleType = Role;
  selectedUser: Role;
  submitted = false;
  loading = false;

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router,
    private translate: TranslateService) { }

  ngOnInit(): void {
  }

  onSubmitUser()
  {
    this.submitted = true;
    if (this.selectedUser != null) {
        this.loading = true;
        this.authService.login(this.selectedUser).pipe(first())
        .subscribe(
            data => {
              this.loading = false;
              this.translate.get("psi.login-msg").subscribe(msg => {
                this.openSnackBar(msg, "OK", "success");
                this.router.navigate(['/educationprograms']);
              });
            },
            error => {
              this.loading = false;
              this.translate.get("psi.login-error-msg").subscribe(msg => 
                this.openSnackBar(msg, "OK", "error"));
            });;
    }
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
