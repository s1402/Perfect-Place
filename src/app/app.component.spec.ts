import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from './common/component/footer/footer.component';

describe('AppComponent', () => {
  let translateService: jasmine.SpyObj<TranslateService>;
  beforeEach(async () => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AppComponent,
        FooterComponent
      ],
      providers: [
        { provide: TranslateService, useValue: translateSpy }
      ]
    }).compileComponents();
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Perfect Place'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Perfect Place');
  });

  it('should set the default language to "en" and use "en" on init', () => {
    TestBed.createComponent(AppComponent); // Trigger constructor
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

});
