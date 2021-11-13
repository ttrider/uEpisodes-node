<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <u-button icon="foo" title="my title" />
    <div class="tree-view">
      <div>Path</div>
      <div>Show Name</div>
      <div>Season</div>
      <div>Episode</div>
      <div>Episode Name</div>
      <div></div>
      <div></div>
      <u-tree-item v-for="wi in items" :key="wi.id" :item="wi" :level="0" />
    </div>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { WorksetModule } from "../store/workset";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  get items() {
    return WorksetModule.fileItems;
    // const i = Object.values(fi);
    // return i;
  }
}
</script>
