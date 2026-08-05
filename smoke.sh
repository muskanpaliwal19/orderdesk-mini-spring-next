#!/bin/sh
set -e

BASE_URL=${BASE_URL:-http://127.0.0.1:8080}
API_URL="$BASE_URL/api"

echo "Smoke test running against $API_URL"

# 1. List orders - should have 4 from seed
echo "\n--- 1. Listing seeded orders ---"
count=$(curl -s "$API_URL/orders" | grep -c "id")
if [ "$count" -ne 4 ]; then
    echo "Expected 4 orders, got $count"
    exit 1
fi
echo "OK: Found 4 orders."

# 2. Create an order
echo "\n--- 2. Creating a new order ---"
create_payload='{"customerName":"Test Customer","customerEmail":"test@example.com","itemDescription":"Test Item","quantity":10,"unitPriceCents":999,"notes":"A test order"}'
created_order_id=$(curl -s -X POST -H "Content-Type: application/json" -d "$create_payload" "$API_URL/orders" | grep -o '"id":[0-9]*' | cut -d: -f2)

if [ -z "$created_order_id" ]; then
    echo "Failed to create order."
    exit 1
fi
echo "OK: Created order with ID $created_order_id"

# 3. Verify creation by listing
echo "\n--- 3. Verifying creation ---"
count=$(curl -s "$API_URL/orders" | grep -c "id")
if [ "$count" -ne 5 ]; then
    echo "Expected 5 orders after creation, got $count"
    exit 1
fi
echo "OK: Found 5 orders."

# 4. Update the order
echo "\n--- 4. Updating the order ---"
update_payload='{"customerName":"Updated Customer","customerEmail":"updated@example.com","itemDescription":"Updated Item","quantity":20,"unitPriceCents":1999,"status":"PAID","notes":"Updated notes"}'
curl -s -X PUT -H "Content-Type: application/json" -d "$update_payload" "$API_URL/orders/$created_order_id" > /dev/null
# check if the notes are updated
notes=$(curl -s "$API_URL/orders/$created_order_id" | grep -o '"notes":"[^"]*"' | cut -d: -f2 | tr -d '"')
if [ "$notes" != "Updated notes" ]; then
    echo "Failed to update order. Notes are: $notes"
    exit 1
fi
echo "OK: Updated order $created_order_id"

# 5. Delete the order
echo "\n--- 5. Deleting the order ---"
curl -s -X DELETE "$API_URL/orders/$created_order_id"
count=$(curl -s "$API_URL/orders" | grep -c "id")
if [ "$count" -ne 4 ]; then
    echo "Expected 4 orders after deletion, got $count"
    exit 1
fi
echo "OK: Deleted order, 4 orders remain."

# 6. Test CSV export
echo "\n--- 6. Testing CSV export ---"
csv_content=$(curl -s -H "Accept: text/csv" "$API_URL/orders/export.csv")
line_count=$(echo "$csv_content" | wc -l)
# header + 4 orders = 5 lines
if [ "$line_count" -ne 5 ]; then
    echo "Expected 5 lines in CSV, got $line_count"
    exit 1
fi
echo "OK: CSV export has correct number of lines."

echo "\nSmoke test PASSED!"
