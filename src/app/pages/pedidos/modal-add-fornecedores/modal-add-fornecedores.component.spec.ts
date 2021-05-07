import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFornecedoresComponent } from './modal-add-fornecedores.component';

describe('ModalAddFornecedoresComponent', () => {
  let component: ModalAddFornecedoresComponent;
  let fixture: ComponentFixture<ModalAddFornecedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddFornecedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddFornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
