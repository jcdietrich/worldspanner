# Worldspanner Home Assistant Dashboard

## Markdown Card - Faction Table

```yaml
type: markdown
content: |
  {% set faction_locations = {
    'Lords': 'Crown District',
    'Warriors': 'Steel Bastion',
    'Defenders': 'Watchman Keep',
    'Villains': 'Dreadmark',
    'Icons': 'Celestial Theatre',
    'Outcasts': 'Smugglers Den',
    'Exemplars': 'Hope Hospice',
    'Adventurers': 'Lostlight Society',
    'Commoners': 'Green Vale'
  } %}
  
  ## Worldspanner Factions
  
  | Faction | Location |
  |---------|----------|
  | {{ states('select.worldspanner_faction_1') }} | {{ faction_locations.get(states('select.worldspanner_faction_1'), 'Unknown') }} |
  | {{ states('select.worldspanner_faction_2') }} | {{ faction_locations.get(states('select.worldspanner_faction_2'), 'Unknown') }} |
  | {{ states('select.worldspanner_faction_3') }} | {{ faction_locations.get(states('select.worldspanner_faction_3'), 'Unknown') }} |
  | {{ states('select.worldspanner_faction_4') }} | {{ faction_locations.get(states('select.worldspanner_faction_4'), 'Unknown') }} |
  | {{ states('select.worldspanner_faction_5') }} | {{ faction_locations.get(states('select.worldspanner_faction_5'), 'Unknown') }} |
  
  **End Round:** {{ states('select.worldspanner_end_round') }}
```

## Script - New Game Reset

Add to `scripts.yaml` or via HA UI:

```yaml
worldspanner_new_game:
  alias: "Worldspanner New Game"
  sequence:
    - service: mqtt.publish
      data:
        topic: "worldspanner/game/reset"
        payload: "1"
```

## Faction Reference

| Faction | Location |
|---------|----------|
| Lords | Crown District |
| Warriors | Steel Bastion |
| Defenders | Watchman Keep |
| Villains | Dreadmark |
| Icons | Celestial Theatre |
| Outcasts | Smugglers Den |
| Exemplars | Hope Hospice |
| Adventurers | Lostlight Society |
| Commoners | Green Vale |
