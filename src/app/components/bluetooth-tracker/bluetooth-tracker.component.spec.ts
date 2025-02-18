import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluetoothTrackerComponent } from './bluetooth-tracker.component';

describe('BluetoothTrackerComponent', () => {
  let component: BluetoothTrackerComponent;
  let fixture: ComponentFixture<BluetoothTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BluetoothTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BluetoothTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
