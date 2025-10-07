import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoContatoComponent } from './novo-contato.component';

describe('NovoContatoComponent', () => {
  let component: NovoContatoComponent;
  let fixture: ComponentFixture<NovoContatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoContatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoContatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
