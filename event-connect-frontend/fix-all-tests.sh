#!/bin/bash

# Script pour fixer automatiquement tous les tests Angular
# Ajoute les providers HttpClient et Router nécessaires

echo "🔧 Fixing Angular component tests..."
echo ""

# Compteur de fichiers fixés
FIXED_COUNT=0

# ============================================
# Fonction pour ajouter les imports
# ============================================
add_imports() {
  local file=$1
  local needs_http=$2
  local needs_router=$3
  
  # Vérifier si les imports existent déjà
  if [ "$needs_http" = true ]; then
    if ! grep -q "provideHttpClient" "$file"; then
      # Trouver la dernière ligne d'import et ajouter après
      sed -i "/^import.*from/a import { provideHttpClient } from '@angular/common/http';\nimport { provideHttpClientTesting } from '@angular/common/http/testing';" "$file"
    fi
  fi
  
  if [ "$needs_router" = true ]; then
    if ! grep -q "provideRouter" "$file"; then
      sed -i "/^import.*from/a import { provideRouter } from '@angular/router';" "$file"
    fi
  fi
}

# ============================================
# Fonction pour ajouter les providers
# ============================================
add_providers() {
  local file=$1
  local needs_http=$2
  local needs_router=$3
  
  # Vérifier si les providers existent déjà
  if grep -q "providers:" "$file"; then
    echo "ℹ️  Providers already exist in $file"
    return
  fi
  
  # Construire la liste des providers
  local providers=""
  
  if [ "$needs_http" = true ]; then
    providers="        provideHttpClient(),\n        provideHttpClientTesting()"
  fi
  
  if [ "$needs_router" = true ]; then
    if [ -n "$providers" ]; then
      providers="$providers,\n        provideRouter([])"
    else
      providers="        provideRouter([])"
    fi
  fi
  
  # Ajouter les providers avant la fermeture de configureTestingModule
  if [ -n "$providers" ]; then
    sed -i "/TestBed.configureTestingModule({/,/})/ {
      /})/ i\      providers: [\n$providers\n      ]
    }" "$file"
  fi
}

# ============================================
# Fonction pour fixer un fichier
# ============================================
fix_file() {
  local file=$1
  local needs_http=$2
  local needs_router=$3
  
  if [ ! -f "$file" ]; then
    echo "⚠️  File not found: $file"
    return
  fi
  
  echo "🔨 Fixing: $file"
  
  # Créer une backup
  cp "$file" "$file.bak"
  
  # Ajouter les imports
  add_imports "$file" "$needs_http" "$needs_router"
  
  # Ajouter les providers
  add_providers "$file" "$needs_http" "$needs_router"
  
  # Vérifier si le fichier a changé
  if ! cmp -s "$file" "$file.bak"; then
    echo "✅ Fixed: $file"
    ((FIXED_COUNT++))
  else
    echo "ℹ️  Already OK: $file"
  fi
  
  # Supprimer la backup
  rm "$file.bak"
}

# ============================================
# COMPOSANTS AVEC HttpClient
# ============================================
echo "📦 Fixing components with HttpClient..."

fix_file "src/app/pages/home-page/home-page.component.spec.ts" true false
fix_file "src/app/pages/organizer-signup-page/organizer-signup-page.component.spec.ts" true false
fix_file "src/app/pages/organizer-home-page/organizer-home-page.component.spec.ts" true false
fix_file "src/app/components/list-event-created/list-event-created.component.spec.ts" true false
fix_file "src/app/components/event-card/event-card.component.spec.ts" true false

echo ""

# ============================================
# COMPOSANTS AVEC Router
# ============================================
echo "🔀 Fixing components with Router..."

fix_file "src/app/app.component.spec.ts" false true
fix_file "src/app/pages/client-signup-page/client-signup-page.component.spec.ts" false true
fix_file "src/app/components/header/header.component.spec.ts" false true
fix_file "src/app/pages/event-details-page/event-details-page.component.spec.ts" false true
fix_file "src/app/pages/event-form-page/event-form-page.component.spec.ts" false true
fix_file "src/app/components/event-form/event-form.component.spec.ts" true true  # Celui-ci a BOTH!
fix_file "src/app/components/footer/footer.component.spec.ts" false true

echo ""
echo "======================================"
echo "✅ Done! Fixed $FIXED_COUNT files"
echo "======================================"
echo ""
echo "Run 'npm test' to verify the fixes"