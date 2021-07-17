import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.min(8), Validators.max(16)]]
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit(e: any) {
    e.preventDefault();
    
    if (this.form.invalid) {
      this.toastrService.danger('Dados inválidos', 'Não é possível logar');
      return;
    }

    const body = {
      email: String(this.form.controls['email'].value),
      senha: String(this.form.controls['senha'].value),
    };

    this.authService
      .login(body)
      .subscribe(
        (lojista) => {
          this.authService.save(lojista);
          this.router.navigate(['/inicio']);
          this.toastrService.success('Logado com sucesso!');
        },
        (err) => {
          console.error(err);
          const titulo = 'Não foi possível realizar login';
          const mensagem = err.status === 500 ? err.error.message : err.error.titulo;
          this.toastrService.danger(mensagem || 'Sem mensagem disponível', titulo);
        }
      );
  }

}
