import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LumpsumComponent } from './lumpsum.component';

describe('LumpsumComponent', () => {
  let component: LumpsumComponent;
  let fixture: ComponentFixture<LumpsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LumpsumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LumpsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
