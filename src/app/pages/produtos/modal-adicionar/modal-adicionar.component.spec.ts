import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdicionarComponent } from './modal-adicionar.component';

describe('ModalAdicionarComponent', () => {
  let component: ModalAdicionarComponent;
  let fixture: ComponentFixture<ModalAdicionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAdicionarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
