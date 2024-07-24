import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAuxComponent } from './login-aux.component';

describe('LoginAuxComponent', () => {
  let component: LoginAuxComponent;
  let fixture: ComponentFixture<LoginAuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginAuxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginAuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
