<template>
  <button class="button" @click="(e) => $emit('click', e)">
    <Icon v-if="hasIcon" tag="div" class="b-icon">
      <SettingsOutlined />
    </Icon>
    <div v-if="hasTitle" class="b-title">
      {{ title }}
    </div>
  </button>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AddCircleOutlineRound, SettingsOutlined } from "@v2icons/material";
import { Icon } from "@v2icons/utils";

@Component({ components: { AddCircleOutlineRound, SettingsOutlined, Icon } })
export default class Button extends Vue {
  @Prop({ required: false }) title?: string;
  @Prop({ required: false }) icon?: string;

  get hasIcon() {
    return !!this.icon;
  }
  get hasTitle() {
    return !!this.title;
  }
}
</script>
