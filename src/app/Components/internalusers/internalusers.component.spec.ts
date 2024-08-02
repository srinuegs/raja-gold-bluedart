import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalusersComponent } from './internalusers.component';

describe('InternalusersComponent', () => {
  let component: InternalusersComponent;
  let fixture: ComponentFixture<InternalusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalusersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternalusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
