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
            autoSize: true #sizes the box matching the inside text, value true or false
            color: black #the color of the text before the threshold is reached
            font: draw #the font of the text
            scale: 1 #the scale of the box, value between 1 and n
            size: m #the size of the text, valued s, m, l, xl
            textAlign: middle #the alignment of the text, value start, middle, end
            w: 200 #the width of the box
            
           
   ```
> Note: Be sure to open Home Assistant using its local address if your component does not seem to update after inserting a new version.

<img width="1258" alt="image" src="https://github.com/user-attachments/assets/9a7f7754-23e1-414e-9158-32f0431987e7">
