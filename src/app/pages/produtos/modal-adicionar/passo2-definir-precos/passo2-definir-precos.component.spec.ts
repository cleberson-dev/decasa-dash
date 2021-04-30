import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Passo2DefinirPrecosComponent } from './passo2-definir-precos.component';

describe('Passo2DefinirPrecosComponent', () => {
  let component: Passo2DefinirPrecosComponent;
  let fixture: ComponentFixture<Passo2DefinirPrecosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Passo2DefinirPrecosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Passo2DefinirPrecosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
