#!/bin/bash

echo "🔧 Fixing all Angular component tests..."
echo ""

FIXED=0

# ============================================
# FIX: app.component.spec.ts
# ============================================
cat > "src/app/app.component.spec.ts" << 'EOF'
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'event-connect-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('event-connect-frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, event-connect-frontend');
  });
});
EOF
echo "✅ Fixed: app.component.spec.ts"
((FIXED++))

# ============================================
# FIX: home-page.component.spec.ts
# ============================================
cat > "src/app/pages/home-page/home-page.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: home-page.component.spec.ts"
((FIXED++))

# ============================================
# FIX: organizer-signup-page.component.spec.ts
# ============================================
cat > "src/app/pages/organizer-signup-page/organizer-signup-page.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrganizerSignupPageComponent } from './organizer-signup-page.component';

describe('OrganizerSignupPageComponent', () => {
  let component: OrganizerSignupPageComponent;
  let fixture: ComponentFixture<OrganizerSignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerSignupPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: organizer-signup-page.component.spec.ts"
((FIXED++))

# ============================================
# FIX: organizer-home-page.component.spec.ts
# ============================================
cat > "src/app/pages/organizer-home-page/organizer-home-page.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrganizerHomePageComponent } from './organizer-home-page.component';

describe('OrganizerHomePageComponent', () => {
  let component: OrganizerHomePageComponent;
  let fixture: ComponentFixture<OrganizerHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerHomePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: organizer-home-page.component.spec.ts"
((FIXED++))

# ============================================
# FIX: list-event-created.component.spec.ts
# ============================================
cat > "src/app/components/list-event-created/list-event-created.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ListEventCreatedComponent } from './list-event-created.component';

describe('ListEventCreatedComponent', () => {
  let component: ListEventCreatedComponent;
  let fixture: ComponentFixture<ListEventCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEventCreatedComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListEventCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: list-event-created.component.spec.ts"
((FIXED++))

# ============================================
# FIX: event-card.component.spec.ts
# ============================================
cat > "src/app/components/event-card/event-card.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventCardComponent } from './event-card.component';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: event-card.component.spec.ts"
((FIXED++))

# ============================================
# FIX: client-signup-page.component.spec.ts
# ============================================
cat > "src/app/pages/client-signup-page/client-signup-page.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClientSignupPageComponent } from './client-signup-page.component';

describe('ClientSignupPageComponent', () => {
  let component: ClientSignupPageComponent;
  let fixture: ComponentFixture<ClientSignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSignupPageComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: client-signup-page.component.spec.ts"
((FIXED++))

# ============================================
# FIX: header.component.spec.ts
# ============================================
cat > "src/app/components/header/header.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: header.component.spec.ts"
((FIXED++))

# ============================================
# FIX: event-details-page.component.spec.ts
# ============================================
cat > "src/app/pages/event-details-page/event-details-page.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventDetailsPageComponent } from './event-details-page.component';

describe('EventDetailsPageComponent', () => {
  let component: EventDetailsPageComponent;
  let fixture: ComponentFixture<EventDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: event-details-page.component.spec.ts"
((FIXED++))

# ============================================
# FIX: event-form-page.component.spec.ts
# ============================================
cat > "src/app/pages/event-form-page/event-form-page.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventFormPageComponent } from './event-form-page.component';

describe('EventFormPageComponent', () => {
  let component: EventFormPageComponent;
  let fixture: ComponentFixture<EventFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormPageComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: event-form-page.component.spec.ts"
((FIXED++))

# ============================================
# FIX: event-form.component.spec.ts
# ============================================
cat > "src/app/components/event-form/event-form.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { EventFormComponent } from './event-form.component';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: event-form.component.spec.ts"
((FIXED++))

# ============================================
# FIX: footer.component.spec.ts
# ============================================
cat > "src/app/components/footer/footer.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
echo "✅ Fixed: footer.component.spec.ts"
((FIXED++))

echo ""
echo "======================================"
echo "✅ Done! Fixed $FIXED files"
echo "======================================"
echo ""
echo "🚀 Now run: npm test"