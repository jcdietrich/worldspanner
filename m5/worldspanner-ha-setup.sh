#!/bin/bash
# Worldspanner - Home Assistant MQTT Setup
# Creates 5 select entities for faction names (with predefined options)
# Creates end_round select entity (8-12)
# Note: The ESPHome device creates these on boot, this script is for manual setup

FACTION_OPTIONS='["Lords","Warriors","Defenders","Villains","Icons","Outcasts","Exemplars","Adventurers","Commoners"]'

# Create MQTT select entities for faction names 1-5
for i in 1 2 3 4 5; do
  mosquitto_pub -h $BROKER -u $USER -P $PASS -r \
    -t "homeassistant/select/worldspanner/faction${i}_name/config" \
    -m "{
      \"name\": \"Faction ${i}\",
      \"unique_id\": \"worldspanner_faction${i}_name\",
      \"command_topic\": \"worldspanner/slot${i}/name/set\",
      \"state_topic\": \"worldspanner/slot${i}/name/state\",
      \"options\": ${FACTION_OPTIONS},
      \"icon\": \"mdi:flag\",
      \"device\": {
        \"identifiers\": [\"worldspanner\"],
        \"name\": \"Worldspanner\",
        \"model\": \"M5Stack Fire\",
        \"manufacturer\": \"M5Stack\"
      }
    }"
  echo "Created faction ${i} select entity"
done

# Create end_round select entity
mosquitto_pub -h $BROKER -u $USER -P $PASS -r \
  -t "homeassistant/select/worldspanner/end_round/config" \
  -m "{
    \"name\": \"End Round\",
    \"unique_id\": \"worldspanner_end_round\",
    \"command_topic\": \"worldspanner/end_round/set\",
    \"state_topic\": \"worldspanner/end_round/state\",
    \"options\": [\"8\",\"9\",\"10\",\"11\",\"12\"],
    \"icon\": \"mdi:flag-checkered\",
    \"device\": {
      \"identifiers\": [\"worldspanner\"],
      \"name\": \"Worldspanner\",
      \"model\": \"M5Stack Fire\",
      \"manufacturer\": \"M5Stack\"
    }
  }"
echo "Created end_round select entity"

echo ""
echo "Done! You should now see these entities in Home Assistant:"
echo "  - select.worldspanner_faction1_name"
echo "  - select.worldspanner_faction2_name"
echo "  - select.worldspanner_faction3_name"
echo "  - select.worldspanner_faction4_name"
echo "  - select.worldspanner_faction5_name"
echo "  - select.worldspanner_end_round"
echo ""
echo "Faction options: Lords, Warriors, Defenders, Villains, Icons, Outcasts, Exemplars, Adventurers, Commoners"
echo "End round options: 8, 9, 10, 11, 12"
