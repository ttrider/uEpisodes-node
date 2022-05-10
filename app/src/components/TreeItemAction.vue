<template>
  <span v-if="item" style="display: contents; font-size: 0.8em">
    <div class="ti-column" :style="titleStyle">FIRST</div>
    <div>STATUS</div>
    <div>LAST</div>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FileSystemItem } from "../model/file-item";

@Component({
  components: {},
})
export default class TreeItem extends Vue {
  @Prop() item!: FileSystemItem;
  @Prop() level!: number;

  get titleStyle() {
    const paddingLeft = this.level ? this.level * 0.4 : 0;
    return {
      paddingLeft: paddingLeft + 3 + "em",
      minWidth: paddingLeft + 7 + "em",
      gridColumn: "1 / span 5",
    };
  }
}
</script>
