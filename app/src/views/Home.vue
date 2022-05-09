<template>
  <div class="home">
    <div class="tree-view">
      <div>Path - {{ items.length }}</div>
      <div>Show</div>
      <div></div>
      <div></div>
      <div>Name</div>
      <div></div>
      <div></div>
      <u-tree-item v-for="wi in items" :key="wi.id" :item="wi" :level="0" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { WorksetModule } from "../store/workset";

@Component({
  components: {},
})
export default class Home extends Vue {
  get items() {
    return WorksetModule.fileItems;
    // const i = Object.values(fi);
    // return i;
  }
}
</script>
