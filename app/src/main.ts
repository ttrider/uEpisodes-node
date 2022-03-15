import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Sidebar from "./components/Sidebar.vue";
import Button from "./components/Button.vue";
import TreeItem from "./components/TreeItem.vue";
import TreeItemEditor from "./components/TreeItemEditor.vue";
import TreeItemEditorCandidate from "./components/TreeItemEditorCandidate.vue";

Vue.config.productionTip = false;

Vue.component("sidebar", Sidebar);
Vue.component("u-button", Button);
Vue.component("u-tree-item", TreeItem);
Vue.component("u-tree-item-editor", TreeItemEditor);
Vue.component("u-tree-item-editor-candidate", TreeItemEditorCandidate);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

store.dispatch("settings/initialize");
