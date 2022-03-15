<template>
  <span v-if="item" style="display: contents">
    <div></div>
    <span class="ti-editor-selection">
      <div class="ti-column" @click="(e) => $emit('click')">
        <div class="ti-text">{{ showName }}</div>
      </div>
      <div class="ti-column" @click="(e) => $emit('click')">{{ season }}</div>
      <div class="ti-column" @click="(e) => $emit('click')">{{ episode }}</div>
      <div class="ti-column" @click="(e) => $emit('click')">
        <div class="ti-text">{{ episodeName }}</div>
      </div>
    </span>
    <div></div>
    <div></div>
  </span>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ShowEpisodeCandidate } from "uepisodes-modules";

@Component({
  components: {},
})
export default class TreeItem extends Vue {
  @Prop() item!: ShowEpisodeCandidate;

  get showName() {
    return this.item.showName ?? "";
  }
  get season() {
    if (this.item.season != undefined) {
      return "S" + this.item.season.toString().padStart(2, "0");
    }
    return "";
  }
  get episode() {
    if (this.item.episode != undefined) {
      return "E" + this.item.episode.toString().padStart(2, "0");
    }
    return "";
  }
  get episodeName() {
    return this.item.episodeName ?? "";
  }
}
</script>
