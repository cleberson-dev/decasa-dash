import { Component, OnInit } from '@angular/core';

type SaveStatus = "saving" | "saved" | "not-saved" | "error";
type Modules = "vendas" | "geral" | "financeiro" | "colaboradores";

@Component({
  selector: 'ngx-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit {
  saveStatuses: Record<Modules, SaveStatus> = {
    geral: 'not-saved',
    vendas: 'not-saved',
    financeiro: 'not-saved',
    colaboradores: 'not-saved',
  };

  constructor() { }

  ngOnInit(): void {
  }

  handleSave(module: Modules) {
    this.saveStatuses[module] = "saving";
    setTimeout(() => {
      this.saveStatuses[module] = this.getRandomStatus();
    }, 3000);
  }

  getSaveIcon(status: SaveStatus) {
    switch (status) {
      case "not-saved":
        return "save";
      case "saving":
        return "refresh";
      case "saved":
        return "checkmark";
      case "error":
        return "close";
    }
  }

  getSaveText(status: SaveStatus) {
    switch (status) {
      case "not-saved":
        return "Salvar";
      case "saving":
        return "Salvando...";
      case "saved":
        return "Salvo";
      case "error":
        return "Não salvo"
    }
  }

  getSaveButtonStatus(status: SaveStatus) {
    switch (status) {
      case "not-saved":
      case "saving":
        return "primary";
      case "saved":
        return "success";
      case "error":
        return "danger";
    }
  }


  getRandomStatus(): SaveStatus {
    const statuses: SaveStatus[] = ["error", "saved"];
    const randomIdx = Math.floor(Math.random() * statuses.length);
    return statuses[randomIdx];
  }
}
