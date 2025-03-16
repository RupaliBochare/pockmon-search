import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsPgaeComponent } from './results-pgae.component';

describe('ResultsPgaeComponent', () => {
  let component: ResultsPgaeComponent;
  let fixture: ComponentFixture<ResultsPgaeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsPgaeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsPgaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
