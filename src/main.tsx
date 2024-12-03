import App from "./App.tsx";
import registerCard from "./utilities/registerCard.ts";

registerCard("ha-draw", App);
registerCard("ha-draw-editor", () => <div>Editor</div>);
