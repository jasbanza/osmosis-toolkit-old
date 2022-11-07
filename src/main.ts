import { createApp } from "vue";

import "./styles/reset.css";
import App from "./App.vue";
import TheHome from "./components/TheHome.vue";
import TheHeader from "./components/common/TheHeader.vue";
import TheFooter from "./components/common/TheFooter.vue";
import TheMask from "./components/common/TheMask.vue";

import { library, dom } from "@fortawesome/fontawesome-svg-core"; /* import the fontawesome core */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; /* import font awesome icon component */
import { fas } from "@fortawesome/free-solid-svg-icons";

const app = createApp(App);

// font awesome component
app.component("font-awesome-icon", FontAwesomeIcon);
// home page
app.component("the-home", TheHome);
// common components
app.component("the-header", TheHeader);
app.component("the-footer", TheFooter);
app.component("the-mask", TheMask);

app.mount("#app");
dom.watch();