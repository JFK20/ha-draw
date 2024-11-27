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
   - type: custom:tldraw-react-card
     entities:
       - sensor.entity:
          name: default value 
          render_attribute: state #what should be show can be any attribute or the default the state
          threshold: 100 #when the render_attribute reaches this threshold the color changes to the limitcolor
          limit_color: blue #the color of the text if the threshold is reached
          unit: #the unit displayed behind the render_attribute, any text 
          x: 1000 #x position of the text
          y: 1000 #y postion of the text
          rotation: 0 #the rotaion of the text box, value between 0 and 360
          opacity: 1 #the opacity of the text, value between 0 and 1
          isLocked: false #
          props: #https://tldraw.dev/reference/tlschema/TLTextShapeProps
            autoSize: true #sizes the box matching the inside text
            
           
   ```
> Note: Be sure to open Home Assistant using its local address if your component does not seem to update after inserting a new version.
### Options
- Threshold (default: 10):  a number. If the state of an entity is greater than the threshold the text switches to the limit Color before that the text color is the given color
- Color (default: black): a String like "black". The color the text has when it's below  a Threshold. For all Possibility check [here](https://tldraw.dev/reference/tlschema/DefaultColorStyle)
- Limit_color (default: red): same as Color but when the state is over or equal the Threshold
- x, y (no default): a number. if not given keeps position assigned in editor. The X and Y position of a textbox
- render_attribute (default: state): a String. the text which is rendered can be set to nay Attribute the entity has
- unit (no default): a String. The unit will be displayed after the render_attribute

<img width="1258" alt="image" src="https://github.com/user-attachments/assets/9a7f7754-23e1-414e-9158-32f0431987e7">
