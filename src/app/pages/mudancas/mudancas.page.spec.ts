import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MudancasPage } from './mudancas.page';

describe('MudancasPage', () => {
  let component: MudancasPage;
  let fixture: ComponentFixture<MudancasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MudancasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MudancasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
