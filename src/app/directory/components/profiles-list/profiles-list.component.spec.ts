import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileslistComponent } from './profiles-list.component';

describe('ProfileslistComponent', () => {
  let component: ProfileslistComponent;
  let fixture: ComponentFixture<ProfileslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
