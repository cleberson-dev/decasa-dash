import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmRotaComponent } from './em-rota.component';

describe('EmRotaComponent', () => {
  let component: EmRotaComponent;
  let fixture: ComponentFixture<EmRotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmRotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmRotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
