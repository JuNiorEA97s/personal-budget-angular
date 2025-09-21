import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3chart } from './d3chart';

describe('D3chart', () => {
  let component: D3chart;
  let fixture: ComponentFixture<D3chart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3chart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(D3chart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
