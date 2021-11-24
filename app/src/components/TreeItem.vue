<template>
  <span v-if="item" style="display: contents">
    <div class="ti-title ti-column" :style="titleStyle" @click="titleClick">
      <Icon v-if="mode === 'folder'" tag="div" size="18px">
        <KeyboardArrowDownOutlined v-if="expanded" />
        <KeyboardArrowRightOutlined v-else />
      </Icon>
      <div v-else style="min-width: 18px; width: 18px"></div>
      <Icon tag="div">
        <component :is="icon" />
      </Icon>
      <div
        style="padding-left: 0.25em; text-overflow: ellipsis; overflow: hidden"
      >
        {{ title }}
      </div>
    </div>
    <template v-if="showInfo">
      <div class="ti-column">{{ showName }}</div>
      <div class="ti-column">{{ season }}</div>
      <div class="ti-column">{{ episode }}</div>
      <div class="ti-column">{{ episodeName }}</div>
    </template>
    <div class="ti-column" v-if="showProgress">progress</div>
    <div class="ti-column">commands here</div>
    <template v-if="expanded">
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
import {
  AddCircleOutlineRound,
  BlockOutlined,
  ClosedCaptionOutlined,
  FolderOutlined,
  ImageOutlined,
  KeyboardArrowDownOutlined,
  KeyboardArrowRightOutlined,
  OndemandVideoOutlined,
  SettingsOutlined,
} from "@v2icons/material";
import { Icon } from "@v2icons/utils";
import path from "path";
import { FileSystemItem } from "../model/file-item";

@Component({
  components: {
    AddCircleOutlineRound,
    BlockOutlined,
    ClosedCaptionOutlined,
    FolderOutlined,
    Icon,
    ImageOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowRightOutlined,
    OndemandVideoOutlined,
    SettingsOutlined,
  },
})
export default class TreeItem extends Vue {
  @Prop() item!: FileSystemItem;
  @Prop() level!: number;

  get mode() {
    return this.item?.mode ?? "other";
  }

  get expanded() {
    return !!this.item?.expanded;
  }

  get showInfo() {
    return this.mode === "video";
  }

  get showProgress() {
    return this.mode !== "other";
  }

  get icon() {
    switch (this.mode) {
      case "video":
        return "OndemandVideoOutlined";
      case "image":
        return "ImageOutlined";
      case "caption":
        return "ClosedCaptionOutlined";
      case "folder":
        return "FolderOutlined";
    }
    return "BlockOutlined";
  }

  get titleStyle() {
    let span = 6;
    if (this.showInfo) {
      span -= 4;
    }
    if (this.showProgress) {
      span--;
    }
    const gridColumn = span != 0 ? "1 / span " + span : undefined;
    const paddingLeft = this.level ? this.level * 0.4 : 0;
    const color =
      this.mode === "video" || this.mode === "caption"
        ? "var(--color-dark)"
        : this.mode !== "folder"
        ? "var(--color-medium)"
        : undefined;
    return {
      paddingLeft: paddingLeft + "em",
      minWidth: paddingLeft + 4 + "em",
      color,
      gridColumn,
      cursor: this.mode === "folder" ? "pointer" : undefined,
    };
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

  get showName() {
    return this.item.showName ?? "<unk>";
  }
  get season() {
    return this.item.season ?? "000";
  }
  get episode() {
    return this.item.episode ?? "000";
  }
  get episodeName() {
    return this.item.episodeName ?? "<unk>";
  }

  titleClick() {
    if (this.item) {
      this.item.expanded = !this.item.expanded;
    }
  }
}
</script>
