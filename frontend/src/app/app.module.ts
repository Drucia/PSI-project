import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DegreesOfStudyComponent } from './degrees-of-study/degrees-of-study.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialElevationDirective } from './common/material-elevation-directive/material-elevation.directive';
import { MatCardModule } from '@angular/material/card';
import { EducationProgramComponent } from './education-program/education-program.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {MatTabsModule} from '@angular/material/tabs';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { FilterPipePipe } from './common/filter/filter-pipe.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import { SubjectCardDialogComponent } from './subject-card-dialog/subject-card-dialog.component';
import { TruncatePipePipe } from './common/filter/truncate-pipe.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AutosizeModule} from '@techiediaries/ngx-textarea-autosize';
import {MatDividerModule} from '@angular/material/divider';
import { FilterFieldsAndSpecPipe } from './common/filter/filter-fields-and-spec.pipe';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ChooseCourseDialogComponent } from './education-program/choose-course-dialog/choose-course-dialog.component';
import { YearsOfStudyComponent } from './years-of-study/years-of-study.component';
import { FilterTermPipe } from './common/filter/filter-term.pipe';
import { SpecializationsComponent } from './specializations/specializations.component';
import { ArtifactsComponent } from './artifacts/artifacts.component';
import {MatListModule} from '@angular/material/list';
import { SubjectCardsComponent } from './subject-cards/subject-cards.component';
import { I18nModule } from './i18n/i18n.module';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbComponent,
    LoginComponent,
    HomeComponent,
    DegreesOfStudyComponent,
    MaterialElevationDirective,
    EducationProgramComponent,
    FilterPipePipe,
    SubjectCardDialogComponent,
    TruncatePipePipe,
    FilterFieldsAndSpecPipe,
    ChooseCourseDialogComponent,
    YearsOfStudyComponent,
    FilterTermPipe,
    SpecializationsComponent,
    ArtifactsComponent,
    SubjectCardsComponent,
    ConfirmDialogComponent
  ],
  imports: [
    I18nModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    FlexLayoutModule,
    MatCardModule,
    MatChipsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    MatTabsModule,
    ScrollingModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    AutosizeModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
