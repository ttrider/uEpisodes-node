import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Sidebar from "./components/Sidebar.vue";
import Button from "./components/Button.vue";
import TreeItem from "./components/TreeItem.vue";

Vue.config.productionTip = false;

Vue.component("sidebar", Sidebar);
Vue.component("u-button", Button);
Vue.component("u-tree-item", TreeItem);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

store.dispatch("settings/initialize");
