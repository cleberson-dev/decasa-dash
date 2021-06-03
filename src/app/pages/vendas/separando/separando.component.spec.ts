import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparandoComponent } from './separando.component';

describe('SeparandoComponent', () => {
  let component: SeparandoComponent;
  let fixture: ComponentFixture<SeparandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeparandoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeparandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
