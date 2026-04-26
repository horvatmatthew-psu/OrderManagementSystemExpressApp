#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <IP>"
  exit 1
fi

IP=$1
BASE_URL="http://$IP:3000/orders"

PASS=0
FAIL=0

log_pass() {
  echo "PASS: $1"
  ((PASS++))
}

log_fail() {
  echo "FAIL: $1"
  ((FAIL++))
}

# ---- 1. GET all orders ----
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$status" = "200" ]; then
  log_pass "GET /orders"
else
  log_fail "GET /orders (status $status)"
fi

# ---- 2. POST valid order ----
create_response=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"John Doe","totalAmount":100}')

create_status=$(echo "$create_response" | jq -r '.success')

if [ "$create_status" = "true" ]; then
  log_pass "POST /orders (valid)"
else
  log_fail "POST /orders (valid)"
fi

# ---- 3. POST invalid order (should fail validation) ----
invalid_status=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"JD"}')   # missing totalAmount

if [ "$invalid_status" = "400" ]; then
  log_pass "POST /orders (invalid validation)"
else
  log_fail "POST /orders (invalid) expected 400 got $invalid_status"
fi

# ---- 4. Get all orders and extract an ID ----
orders_json=$(curl -s "$BASE_URL")
order_id=$(echo "$orders_json" | jq -r '.data[0].id')

if [ "$order_id" != "null" ] && [ -n "$order_id" ]; then
  log_pass "Extract order ID"
else
  log_fail "Failed to extract order ID"
fi

# ---- 5. GET order by ID ----
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$order_id")

if [ "$status" = "200" ]; then
  log_pass "GET /orders/:id"
else
  log_fail "GET /orders/:id (status $status)"
fi

# ---- 6. GET non-existent order ----
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/999999")

if [ "$status" = "404" ]; then
  log_pass "GET /orders/:id (not found)"
else
  log_fail "GET non-existent order expected 404 got $status"
fi

# ---- 7. PATCH update order ----
update_status=$(curl -s -o /dev/null -w "%{http_code}" \
  -X PATCH "$BASE_URL/$order_id" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Updated Name"}')

if [ "$update_status" = "200" ]; then
  log_pass "PATCH /orders/:id"
else
  log_fail "PATCH failed (status $update_status)"
fi

# ---- 8. DELETE order ----
delete_status=$(curl -s -o /dev/null -w "%{http_code}" \
  -X DELETE "$BASE_URL/$order_id")

if [ "$delete_status" = "204" ]; then
  log_pass "DELETE /orders/:id"
else
  log_fail "DELETE failed (status $delete_status)"
fi

# ---- 9. DELETE again (should 404) ----
delete_status=$(curl -s -o /dev/null -w "%{http_code}" \
  -X DELETE "$BASE_URL/$order_id")

if [ "$delete_status" = "404" ]; then
  log_pass "DELETE non-existent order"
else
  log_fail "DELETE non-existent expected 404 got $delete_status"
fi

# ---- Summary ----
echo "======================"
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ "$FAIL" -ne 0 ]; then
  exit 1
else
  exit 0
fi