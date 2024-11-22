import App from "./App.tsx";
import registerCard from "./utilities/registerCard.ts";

registerCard("tldraw-react-card", App);
registerCard("tldraw-react-card-editor", () => <div>Editor</div>);
