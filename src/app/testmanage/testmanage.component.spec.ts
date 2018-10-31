import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestmanageComponent } from './testmanage.component';

describe('TestmanageComponent', () => {
  let component: TestmanageComponent;
  let fixture: ComponentFixture<TestmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
