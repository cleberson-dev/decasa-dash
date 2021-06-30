import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

type APIStatuses = "loading" | "working" | "not-working" | "hovered";

@Component({
  selector: 'api-status-indicator',
  templateUrl: './api-status-indicator.component.html',
  styleUrls: ['./api-status-indicator.component.scss']
})
export class ApiStatusIndicatorComponent implements OnInit {
  apiStatus: APIStatuses = "loading";
  previousStatus: APIStatuses = "loading";

  constructor(
    private apiService: ApiService,
  ) { }

  updateStatus() {
    this.apiStatus = "loading";
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

  ngOnInit(): void {
    this.updateStatus();
  }

  get color() {
    const colors: Record<APIStatuses, string> = {
      "loading": "warning",
      "working": "success",
      "not-working": "danger",
      "hovered": "info",
    };

    return colors[this.apiStatus];
  }

  get text() {
    const options: Record<APIStatuses, string> = {
      "loading": "Carregando API",
      "working": "API funcionando",
      "not-working": "API não está funcionando",
      "hovered": "Atualizar API"
    };

    return options[this.apiStatus];
  }

  get icon() {
    const icons: Record<APIStatuses, string> = {
      "loading": "loader-outline",
      "working": "checkmark-outline",
      "not-working": "close-outline",
      "hovered": "refresh-outline",
    };

    return icons[this.apiStatus];
  }

  onHover() {
    this.previousStatus = this.apiStatus;
    this.apiStatus = "hovered";
  }

  onLeave() {
    this.apiStatus = this.previousStatus;
  }
}
