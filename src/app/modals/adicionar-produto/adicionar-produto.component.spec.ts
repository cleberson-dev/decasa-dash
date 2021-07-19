import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarProdutoModalComponent } from './adicionar-produto.component';

describe('AdicionarProdutoModalComponent', () => {
  let component: AdicionarProdutoModalComponent;
  let fixture: ComponentFixture<AdicionarProdutoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdicionarProdutoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarProdutoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
