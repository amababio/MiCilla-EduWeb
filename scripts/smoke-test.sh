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

CODE=$(curl -s -o /tmp/micilla-health.json -w "%{http_code}" "$BASE/api/health")
check "GET /api/health" "200" "$CODE"
check_contains "Health check ok" "\"status\":\"ok\"" "/tmp/micilla-health.json"

CODE=$(curl -s -o /tmp/micilla-school-ris.html -w "%{http_code}" "$BASE/schools/redemption-international-school")
check "GET /schools/redemption-international-school" "200" "$CODE"
check_contains "School route has RIS name" "Redemption International School" "/tmp/micilla-school-ris.html"

CODE=$(curl -s -o /tmp/micilla-school-gbs.html -w "%{http_code}" "$BASE/schools/grace-basic-school")
check "GET /schools/grace-basic-school" "200" "$CODE"
check_contains "School route has GBS name" "Grace Basic School" "/tmp/micilla-school-gbs.html"

CODE=$(curl -s -o /tmp/micilla-school-not-found.html -w "%{http_code}" "$BASE/schools/not-a-real-school")
check "GET /schools/not-a-real-school" "404" "$CODE"
check_contains "Not found page" "Page not found" "/tmp/micilla-school-not-found.html"

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
check_contains "School profile logo upload" "Upload Logo" "/tmp/micilla-profile.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-programs.html -w "%{http_code}" "$BASE/admin/programs")
check "GET /admin/programs" "200" "$CODE"
check_contains "Programs page" "Programs" "/tmp/micilla-programs.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-photos.html -w "%{http_code}" "$BASE/admin/photos")
check "GET /admin/photos" "200" "$CODE"
check_contains "Photos page" "Photos" "/tmp/micilla-photos.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-achievements.html -w "%{http_code}" "$BASE/admin/achievements")
check "GET /admin/achievements" "200" "$CODE"
check_contains "Achievements page" "Achievements" "/tmp/micilla-achievements.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-notices.html -w "%{http_code}" "$BASE/admin/notices")
check "GET /admin/notices" "200" "$CODE"
check_contains "Notices page" "Notices" "/tmp/micilla-notices.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-files.html -w "%{http_code}" "$BASE/admin/files")
check "GET /admin/files" "200" "$CODE"
check_contains "Files page" "Files" "/tmp/micilla-files.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/micilla-schedule.html -w "%{http_code}" "$BASE/admin/schedule")
check "GET /admin/schedule" "200" "$CODE"
check_contains "Schedule page" "Schedule" "/tmp/micilla-schedule.html"

CODE=$(curl -s -o /tmp/micilla-home-schedule.html -w "%{http_code}" "$BASE/")
check "GET / for schedule section" "200" "$CODE"
check_contains "Homepage has schedule section" "School Schedule" "/tmp/micilla-home-schedule.html"

CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /dev/null -w "%{http_code}" -X POST "$BASE/api/admin/logout")
check "POST logout" "200" "$CODE"
CODE=$(curl -s -c "$COOKIE" -b "$COOKIE" -o /dev/null -w "%{http_code}" "$BASE/admin/dashboard")
check "GET /admin/dashboard after logout" "307" "$CODE"

# Repeat homepage after auth flow — catches dev cache corruption
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
check "GET / after auth flow" "200" "$CODE"

SUPER_COOKIE=$(mktemp)
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/super-admin/login")
check "GET /super-admin/login" "200" "$CODE"

CODE=$(curl -s -o /tmp/micilla-super-login.json -w "%{http_code}" -X POST "$BASE/api/super-admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"super@micilla.com","password":"wrong"}')
check "POST super-admin login wrong password" "401" "$CODE"

CODE=$(curl -s -c "$SUPER_COOKIE" -b "$SUPER_COOKIE" -o /tmp/micilla-super-login.json -w "%{http_code}" -X POST "$BASE/api/super-admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"super@micilla.com","password":"super123!"}')
check "POST super-admin login correct" "200" "$CODE"

CODE=$(curl -s -c "$SUPER_COOKIE" -b "$SUPER_COOKIE" -o /tmp/micilla-super-dash.html -w "%{http_code}" "$BASE/super-admin/dashboard")
check "GET /super-admin/dashboard (auth)" "200" "$CODE"
check_contains "Super admin dashboard" "All Schools" "/tmp/micilla-super-dash.html"

CODE=$(curl -s -c "$SUPER_COOKIE" -b "$SUPER_COOKIE" -o /dev/null -w "%{http_code}" -X POST "$BASE/api/super-admin/logout")
check "POST super-admin logout" "200" "$CODE"

rm -f "$COOKIE" "$SUPER_COOKIE" /tmp/micilla-home.html /tmp/micilla-health.json /tmp/micilla-home-schedule.html /tmp/micilla-school-ris.html /tmp/micilla-school-gbs.html /tmp/micilla-school-not-found.html /tmp/micilla-school-gbs.html /tmp/micilla-dash.html /tmp/micilla-homepage-content.html /tmp/micilla-profile.html /tmp/micilla-programs.html /tmp/micilla-photos.html /tmp/micilla-achievements.html /tmp/micilla-notices.html /tmp/micilla-files.html /tmp/micilla-schedule.html /tmp/micilla-login.json /tmp/micilla-super-login.json /tmp/micilla-super-dash.html

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
exit "$FAIL"
