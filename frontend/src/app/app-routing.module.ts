import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtifactsComponent } from './artifacts/artifacts.component';
import { DegreesOfStudyComponent } from './degrees-of-study/degrees-of-study.component';
import { EducationProgramComponent } from './education-program/education-program.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth.guard';
import { SpecializationsComponent } from './specializations/specializations.component';
import { SubjectCardsComponent } from './subject-cards/subject-cards.component';
import { YearsOfStudyComponent } from './years-of-study/years-of-study.component';

const routes: Routes = [
  {
      path: '',
      data: {
          breadcrumb: 'strona główna',
          breadcrumbEng: 'home'
      },
      children: [
          {
              path: '',
              component: HomeComponent
          },
          {
              path: 'educationprograms',
              data: {
                  breadcrumb: 'programy kształcenia',
                  breadcrumbEng: 'education programs'
              },
              children: [
                  {
                      path: '',
                      component: DegreesOfStudyComponent
                  },
                  {
                    path: 'new',
                    data: {
                        breadcrumb: 'nowy',
                        breadcrumbEng: 'new'
                    },
                    component: EducationProgramComponent,
                    canActivate: [ AuthGuardService ]
                  },
                  {
                    path: 'degrees',
                    children: [
                      {
                        path: ':degreeId',
                        component: YearsOfStudyComponent,
                        data: {
                          breadcrumb: 'studia',
                          breadcrumbEng: 'study'
                        },
                      },
                      {
                        path: ':degreeId/edit/:id',
                        data: {
                            breadcrumb: 'edycja cyklu kształcenia',
                            breadcrumbEng: 'edition of the education cycle'
                        },
                        component: EducationProgramComponent,
                        canActivate: [ AuthGuardService ]
                      },
                      {
                        path: ':degreeId/specializations/:year/:term/:field',
                        data: {
                            breadcrumb: 'specjalności',
                            breadcrumbEng: 'specializations'
                        },
                        component: SpecializationsComponent
                      },
                      {
                        path: ':degreeId/artifacts',
                        data: {
                            breadcrumb: 'artefakty',
                            breadcrumbEng: 'artifacts'
                        },
                        children: [
                          {
                            path: ':programId',
                            component: ArtifactsComponent,
                          },
                          {
                            path: ':programId/cards',
                            data: {
                              breadcrumb: 'karty przedmiotów',
                              breadcrumbEng: 'subject cards'
                            },
                            component: SubjectCardsComponent
                          }
                        ],
                      },
                  ]},
              ]
          }
        ]
  },
  {
      path: 'login',
      data: {
          breadcrumb: null
      },
      component: LoginComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
