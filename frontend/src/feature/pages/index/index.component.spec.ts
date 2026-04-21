import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexComponent } from './index.component';


describe('IndexComponent', () => {

  let fixture:   ComponentFixture<IndexComponent>;
  let component: IndexComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
