<template>
  <span v-if="item" style="display: contents">
    <div class="ti-title ti-column" :style="titleStyle">{{ title }}</div>
    <template v-if="showInfo">
      <div class="ti-column">show name</div>
      <div class="ti-column">season number</div>
      <div class="ti-column">episode number</div>
      <div class="ti-column">episode name</div>
    </template>
    <div class="ti-column" v-if="showProgress">progress</div>
    <div class="ti-column">commands here</div>
    <template v-if="item.expanded">
      <u-tree-item
        v-for="fi in children"
        :key="fi.id"
        :item="fi"
        :level="level + 1"
      />
    </template>
  </span>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AddCircleOutlineRound, SettingsOutlined } from "@v2icons/material";
import { Icon } from "@v2icons/utils";
import { FileSystemItem } from "@/store/workset";
import path from "path";

@Component({ components: { AddCircleOutlineRound, SettingsOutlined, Icon } })
export default class TreeItem extends Vue {
  @Prop() item!: FileSystemItem;
  @Prop() level!: number;

  get mode() {
    return this.item?.mode ?? "unknown";
  }

  get titleStyle() {
    switch (this.mode) {
      case "folder":
        return {
          gridColumn: "1 / span 5",
          paddingLeft: this.level ? this.level + "em" : "0",
        };
      case "file":
        return {
          paddingLeft: this.level ? this.level + "em" : "0",
        };
    }
    return {
      gridColumn: "1 / span 6",
      paddingLeft: this.level ? this.level + "em" : "0",
    };
  }

  get showInfo() {
    return this.mode === "file";
  }

  get showProgress() {
    return this.mode !== "unknown";
  }

  get displayItem() {
    if (this.item) {
      const ret = {
        title: this.item.title,
        children: this.item.children,
      };
      while (ret.children.length === 1) {
        const child = ret.children[0];
        if (child.mode !== "folder") {
          break;
        }
        ret.title = ret.title + path.sep + child.title;
        ret.children = child.children;
      }
      ret.children.sort((a, b) => (a.name < b.name ? -1 : 1));

      return ret;
    }
    return {
      title: "",
      children: [],
    };
  }

  get children() {
    return this.displayItem.children;
  }
  get title() {
    return this.displayItem.title;
  }
}
</script>
