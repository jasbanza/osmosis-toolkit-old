import { createApp } from "vue";

import "./styles/reset.css";
import App from "./App.vue";
import TheHome from "./components/TheHome.vue";
import TheHeader from "./components/common/TheHeader.vue";
import TheFooter from "./components/common/TheFooter.vue";
import TheMask from "./components/common/TheMask.vue";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { fat } from '@fortawesome/pro-thin-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fass } from '@fortawesome/sharp-solid-svg-icons'

const app = createApp(App);

// font awesome component
app.component("font-awesome-icon", FontAwesomeIcon);
library.add(fas, far, fal, fat, fad, fass);
// home page
app.component("the-home", TheHome);
// common components
app.component("the-header", TheHeader);
app.component("the-footer", TheFooter);
app.component("the-mask", TheMask);

app.mount("#app");
dom.watch();