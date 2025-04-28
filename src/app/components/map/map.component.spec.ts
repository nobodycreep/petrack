import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapComponent] // <-- Aquí debe ser declarations
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapComponent); // <-- Aquí no pasas la variable, sino el tipo
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

