import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';

type APIStatuses = "loading" | "working" | "not-working";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  currentTheme = 'default';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  apiStatus: APIStatuses = "loading";

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private apiService: ApiService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.apiService.getDepartments()
        .subscribe(
          (_) => { // WORKING
            this.apiStatus = 'working';
          },
          (_) => { // SOME ERROR OCCURRED
            this.apiStatus = 'not-working';
          }
        ); 
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  get apiStatusBtnColor() {
    switch (this.apiStatus) {
      case "loading":
        return "warning";
      case "working":
        return "success";
      case "not-working":
        return "danger";
    }
  }

  get apiStatusBtnText() {
    switch (this.apiStatus) {
      case "loading":
        return "Carregando API";
      case "working":
        return "API funcionando";
      case "not-working":
        return "API não está funcionando";
    }
  }

  get apiStatusBtnIcon() {
    switch (this.apiStatus) {
      case "loading":
        return "loader-outline";
      case "working":
        return "checkmark-outline";
      case "not-working":
        return "close-outline";
    }
  }
}
