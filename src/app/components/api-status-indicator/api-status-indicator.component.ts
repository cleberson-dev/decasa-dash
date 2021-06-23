import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

type APIStatuses = "loading" | "working" | "not-working";

@Component({
  selector: 'api-status-indicator',
  templateUrl: './api-status-indicator.component.html',
  styleUrls: ['./api-status-indicator.component.scss']
})
export class ApiStatusIndicatorComponent implements OnInit {
  apiStatus: APIStatuses = "loading";

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
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

  get color() {
    switch (this.apiStatus) {
      case "loading":
        return "warning";
      case "working":
        return "success";
      case "not-working":
        return "danger";
    }
  }

  get text() {
    switch (this.apiStatus) {
      case "loading":
        return "Carregando API";
      case "working":
        return "API funcionando";
      case "not-working":
        return "API não está funcionando";
    }
  }

  get icon() {
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
