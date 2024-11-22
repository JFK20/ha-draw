# Home Assistant: React Lovelace Card
#### (React + TypeScript + Vite)

This project was bootstrapped from the @vite template which provides a minimal setup to get React working in Vite with some ESLint rules.

## To install:

Node.js
```bash
npm install
```

Bun.js
```bash
bun install
```

## To build with profiler:

Node.js
```bash
npx vite build --mode development
```

Bun.js
```bash
bun x vite build --mode development
```

## To build with minification and optimisations:

Node.js
```bash
npx vite build
```

Bun.js
```bash
bun x vite build
```

## To add to Lovelace:

### Option 1: Install via HACS
1. Add this repository as a custom repository in HACS.
2. Install the tldraw-react-ha card via HACS.
3. Reload your Home Assistant.
4. Create your custom card

### Option 2: Build it yourself
1. Build the app
2. Copy the built bundle located at `dist/tl-draw-ha.*`
3. Paste your bundle into `/config/www/tl-draw-ha.*` of your Home Assistant setup
4. Add `/local/tl-draw-ha.*` as a [resource on Lovelace](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#referencing-your-new-card)
5. Reload your Home Assistant
6. Create your custom card

## Create Custom Card
   ```yaml
   - type: custom:tldraw-react-card
     entities:
       - sensor.plug_pcsetup_leistung:
           threshold: 100
           color: green
           limit_color: blue
           x: 1000
           y: 1000
       - sensor.plug_minipc_leistung:
           threshold: 8
           limit_color: red
   ```
> Note: Be sure to open Home Assistant using its local address if your component does not seem to update after inserting a new version.
### Options
- Threshold(default: 10): should be a number. If the state of an entity is greater than the threshold the text switches to the limit Color before that the text color is the given color
- Color(default: black): should be a String like "black". The color the text has when it's below  a Threshold. For all Possibility check [here](https://tldraw.dev/reference/tlschema/DefaultColorStyle)
- Limit_color(default: red): same as Color but when the state is over or equal the Threshold
- x, y: no default if not given keeps position assigned in editor. The X and Y position of a textbox
  


<img width="1258" alt="image" src="https://github.com/user-attachments/assets/4ff43dfc-7210-4d7f-8443-c016daf811b8">
