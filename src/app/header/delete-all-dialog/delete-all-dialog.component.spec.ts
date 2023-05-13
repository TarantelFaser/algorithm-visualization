import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAllDialogComponent } from './delete-all-dialog.component';

describe('DeleteAllDialogComponent', () => {
  let component: DeleteAllDialogComponent;
  let fixture: ComponentFixture<DeleteAllDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAllDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAllDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
