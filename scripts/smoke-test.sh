#!/usr/bin/env bash
# Smoke tests for MiCilla EduWeb — run while dev or production server is up on :3000
set -uo pipefail

BASE="${BASE_URL:-http://localhost:3000}"
COOKIE=$(mktemp)
PASS=0
FAIL=0

check() {
  local name="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then
    echo "✓ $name ($actual)"
    PASS=$((PASS + 1))
  else
    echo "✗ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

check_contains() {
  local name="$1" needle="$2" file="$3"
  if grep -Fq "$needle" "$file"; then
    echo "✓ $name"
    PASS=$((PASS + 1))
  else
    echo "✗ $name (missing: $needle)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== MiCilla EduWeb smoke tests ($BASE) ==="

# Warm up dev server — first compile can return a partial shell
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  CODE=$(curl -s -o /tmp/micilla-home.html -w "%{http_code}" "$BASE/")
  if [ "$CODE" = "200" ] && grep -Fq "Redemption International School" /tmp/micilla-home.html; then
    break
  fi
  sleep 2
done
check "GET /" "200" "$CODE"
check_contains "Homepage has school name" "Redemption International School" "/tmp/micilla-home.html"
check_contains "Homepage has hero" "Quality education" "/tmp/micilla-home.html"
check_contains "Homepage has footer" "MiCilla Technologies" "/tmp/micilla-home.html"
check_contains "Homepage has brand CSS" "color-mauve-500" "/tmp/micilla-home.html"

CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/admin/login")
check "GET /admin/login" "200" "$CODE"

CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/admin/dashboard")
check "GET /admin/dashboard (no auth)" "307" "$CODE"

CODE=$(curl -s -o /tmp/micilla-login.json -w "%{http_code}" -X POST "$BASE/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"wrong"}')
check "POST login wrong password" "401" "$CODE"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-login.json -w "%{http_code}" -X POST "$BASE/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123!"}')
check "POST login correct" "200" "$CODE"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-dash.html -w "%{http_code}" "$BASE/admin/dashboard")
check "GET /admin/dashboard (auth)" "200" "$CODE"
check_contains "Dashboard has school name" "Redemption International School" "/tmp/micilla-dash.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-homepage-content.html -w "%{http_code}" "$BASE/admin/homepage-content")
check "GET /admin/homepage-content" "200" "$CODE"
check_contains "Homepage content form" "Homepage Content" "/tmp/micilla-homepage-content.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-profile.html -w "%{http_code}" "$BASE/admin/school-profile")
check "GET /admin/school-profile" "200" "$CODE"
check_contains "School profile form" "School Profile" "/tmp/micilla-profile.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /dev/null -w "%{http_code}" -X POST "$BASE/api/admin/logout")
check "POST logout" "200" "$CODE"
CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /dev/null -w "%{http_code}" "$BASE/admin/dashboard")
check "GET /admin/dashboard after logout" "307" "$CODE"

# Repeat homepage after auth flow — catches dev cache corruption
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
check "GET / after auth flow" "200" "$CODE"

rm -f "$COOKIE" /tmp/micilla-home.html /tmp/micilla-dash.html /tmp/micilla-homepage-content.html /tmp/micilla-profile.html /tmp/micilla-login.json

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
exit "$FAIL"
