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
    const colors: Record<APIStatuses, string> = {
      "loading": "warning",
      "working": "success",
      "not-working": "danger"
    };

    return colors[this.apiStatus];
  }

  get text() {
    const options: Record<APIStatuses, string> = {
      "loading": "Carregando API",
      "working": "API funcionando",
      "not-working": "API não está funcionando"
    };

    return options[this.apiStatus];
  }

  get icon() {
    const icons: Record<APIStatuses, string> = {
      "loading": "loader-outline",
      "working": "checkmark-outline",
      "not-working": "close-outline"
    };

    return icons[this.apiStatus];
  }
}
