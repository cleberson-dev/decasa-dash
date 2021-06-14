import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type SaveStatus = "saving" | "saved" | "not-saved" | "error";
type Modules = "vendas" | "geral" | "financeiro" | "colaboradores";
type DeliveryTypes = "retira" | "entrega" | "nenhum";
type Endereco = {
  nome: string;
  tipo?: DeliveryTypes;
  balcao: boolean;
  online: boolean;
}
type Loja = {
  nome: string;
  caixas: string[];
};

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

  enderecos: Endereco[] = [
    { nome: 'Endereço #1', tipo: 'entrega', balcao: false, online: false },
    { nome: 'Av. Jeronimo de Albuquerque', tipo: 'nenhum', balcao: false, online: false },
    { nome: 'Av. Daniel de La Touche', tipo: 'retira', balcao: true, online: false }
  ];

  lojas = [
    { title: 'Loja 01', value: '1' },
    { title: 'Loja 02', value: '2' },
    { title: 'Loja 03', value: '3' },
  ];

  colaboradores = [
    { nome: 'Colaborador 01', value: '1' },
    { nome: 'Colaborador 02', value: '2' },
    { nome: 'Colaborador 03', value: '3' },
  ];

  caixas = [
    { numero: '999999', loja: this.lojas[0].title, colaborador: this.colaboradores[0].nome },
    { numero: '888888', loja: this.lojas[0].title, colaborador: this.colaboradores[1].nome },
    { numero: '777777', loja: this.lojas[1].title, colaborador: this.colaboradores[2].nome },
  ];

 

  caixaForm = this.fb.group({
    numero: ['', [Validators.required]],
    loja: ['', [Validators.required]],
    colaborador: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder
  ) { }

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


  saveAll() {
    console.log(this.enderecos.map(e => e.tipo));
    Object.keys(this.saveStatuses)
      .forEach((key: Modules) => this.handleSave(key));
  }

  handleTipoChange(tipo: DeliveryTypes, endereco: Endereco, pressed: boolean) {
    endereco.tipo = pressed ? tipo : endereco.tipo;
  }

  onCaixaFormSubmit() {
    this.caixas.push({
      numero: this.caixaForm.controls['numero'].value,
      loja: this.lojas.find(loja => loja.value === this.caixaForm.controls['loja'].value).title,
      colaborador: this.colaboradores.find(colab => colab.value === this.caixaForm.controls['colaborador'].value).nome
    });

    this.caixaForm.reset();
  }
}
