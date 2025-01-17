# Home Assistant: React Lovelace Card

This project was bootstrapped from the [homeassistant-react-lovelace](https://github.com/samuelthng/homeassistant-react-lovelace) Repo which provides a minimal setup to get vite working in Home Assistant with some ESLint rules.

## To add to Lovelace:

### Install via HACS
1. Add this repository as a custom repository in HACS.
2. Install the ha-draw card via HACS.
3. Reload your Home Assistant.
4. Create your custom card

## Create Custom Card
   ```yaml
   - type: custom:ha-draw
     name: filename_addition #the addition to the filename
     groups:
      - entities: #a list of entities when one of them changes the tldraw Component is updated
          - sensor.plug_pcsetup_leistung
        template: | #the Template which Result Value is used on the parameter
          {{ states('sensor.plug_pcsetup_leistung', with_unit=true) }}
        tldraw:
          id: MUdaPeWuusluTr7_5Ri5A #the ID of the Shape without shape:
          parameter: props.text #the parameter of the tldraw Component which is changed
          valuetype: current # current or absolut. current is the current value.
          #Absolute adds the values just possible with numbers
          on_error: previous #if previous the last working value is displayed
      - entities:
          - sensor.plug_minipc_leistung
        template: |
          {% if states('sensor.plug_minipc_leistung') | float > 7 %}
            red
          {% else %}
            green
          {% endif %}
        tldraw:
          id: Sh5qeuGuvPte75xd4euyN
          parameter: props.color
          valuetype: current
          on_error: previous
   ```
> Note: Be sure to open Home Assistant using its local address if your component does not seem to update after inserting a new version.

![Image](https://github.com/user-attachments/assets/5b7b9c57-32ce-412a-8288-76935220e508)
