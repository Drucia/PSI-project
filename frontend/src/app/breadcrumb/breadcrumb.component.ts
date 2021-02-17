import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { IBreadCrumb } from '../models/ibread-crumb';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
    public breadcrumbs: IBreadCrumb[];
    isPolish: boolean;

    constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    translate: TranslateService) {
        this.isPolish = translate.currentLang.includes('pl');
        translate.onLangChange.subscribe((params) => { 
          this.isPolish = params['lang'].includes('pl');
        });
    }

    ngOnInit(): void {
        this.router.events.pipe(
            filter((event: Event) => event instanceof NavigationEnd),
            distinctUntilChanged(),
        ).subscribe(() => {
            this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
        })
    }

  /**
   * Recursively build breadcrumb according to activated route.
   * @param route
   * @param url
   * @param breadcrumbs
   */
    buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
        let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
        let engLabel = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumbEng : '';
        let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

        // If the route is dynamic route such as ':id', remove it
        const lastRoutePart = path.split('/').pop();
        const isDynamicRoute = lastRoutePart.startsWith(':');
        if(isDynamicRoute && !!route.snapshot) {
            const paramName = lastRoutePart.split(':')[1];
            path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
            label = label ? label : route.snapshot.params[paramName];
            engLabel = engLabel ? engLabel : route.snapshot.params[paramName];
        }

        //In the routeConfig the complete path is not available,
        //so we rebuild it each time
        const nextUrl = path ? `${url}/${path}` : url;

        const breadcrumb: IBreadCrumb = {
            label: label ? label.toUpperCase() : label,
            engLabel: engLabel ? engLabel.toUpperCase() : engLabel,
            url: nextUrl,
        };
        // Only adding route with non-empty label
        const newBreadcrumbs = breadcrumb.label ? [ ...breadcrumbs, breadcrumb ] : [ ...breadcrumbs];
        if (route.firstChild) {
            //If we are not on our current path yet,
            //there will be more children to look after, to build our breadcumb
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }
        return newBreadcrumbs;
    }
}
