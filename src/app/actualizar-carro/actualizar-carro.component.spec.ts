import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCarroComponent } from './actualizar-carro.component';

describe('ActualizarCarroComponent', () => {
  let component: ActualizarCarroComponent;
  let fixture: ComponentFixture<ActualizarCarroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualizarCarroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActualizarCarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
