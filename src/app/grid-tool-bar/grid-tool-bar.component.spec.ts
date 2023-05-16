import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridToolBarComponent } from './grid-tool-bar.component';

describe('GridToolBarComponent', () => {
  let component: GridToolBarComponent;
  let fixture: ComponentFixture<GridToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridToolBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
