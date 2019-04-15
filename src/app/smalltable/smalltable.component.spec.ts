import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmalltableComponent } from './smalltable.component';

describe('SmalltableComponent', () => {
  let component: SmalltableComponent;
  let fixture: ComponentFixture<SmalltableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmalltableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmalltableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
