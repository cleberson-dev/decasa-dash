import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoLojistaComponent } from './produto-lojista.component';

describe('ProdutoLojistaComponent', () => {
  let component: ProdutoLojistaComponent;
  let fixture: ComponentFixture<ProdutoLojistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoLojistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoLojistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
