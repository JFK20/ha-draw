# Home Assistant: React Lovelace Card
#### (React + TypeScript + Vite)

This project was bootstrapped from the @vite template which provides a minimal setup to get React working in Vite with some ESLint rules.

## To add to Lovelace:

### Install via HACS
1. Add this repository as a custom repository in HACS.
2. Install the tldraw-react-ha card via HACS.
3. Reload your Home Assistant.
4. Create your custom card

## Create Custom Card
   ```yaml
   - type: custom:ha-draw
        groups:
          - entities:
              - sensor.plug_pcsetup_leistung #the entities beloning to the group an triggering the update
            template: |
              {{ states('sensor.plug_pcsetup_leistung') }} # a Template which get resolved and the value gets used
            tldraw:
              id: plug_pcsetup_leistung #id of the shape that gets drawn
              parameter: value #the parameter which to change value changes the text while fill changes the color of the box
              valuetype: current #current every time the template reevalutes the parameter is set new if absolute its added up currently just works for numbers
              on_error: previous #currently not working
          - entities:
              - sensor.plug_minipc_leistung
            template: |
              {% if states('sensor.plug_minipc_leistung') | float > 7 %}
                red
              {% else %}
               green
              {% endif %}
            tldraw:
              id: plug_minipc_leistung
              parameter: fill
              valuetype: current
              on_error: previous
   ```
> Note: Be sure to open Home Assistant using its local address if your component does not seem to update after inserting a new version.

<img width="1258" alt="image" src="https://github.com/user-attachments/assets/9a7f7754-23e1-414e-9158-32f0431987e7">
