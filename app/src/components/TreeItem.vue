<template>
  <span v-if="item && visible" style="display: contents" :class="className"
    ><span class="ti-item">
      <div class="ti-title ti-column" :style="titleStyle" @click="titleClick">
        <Icon v-if="mode === 'folder'" tag="div" size="18px">
          <KeyboardArrowDownOutlined v-if="expanded" />
          <KeyboardArrowRightOutlined v-else />
        </Icon>
        <div v-else style="min-width: 18px; width: 18px"></div>
        <Icon tag="div">
          <component :is="icon" />
        </Icon>
        <div class="ti-text" style="padding-left: 0.25em">
          {{ title }}
        </div>
      </div>
      <template v-if="showInfo">
        <div class="ti-column">
          <div class="ti-text">{{ showName }}</div>
        </div>
        <div class="ti-column">{{ season }}</div>
        <div class="ti-column">{{ episode }}</div>
        <div class="ti-column">
          <div class="ti-text">{{ episodeName }}</div>
        </div>
      </template>
      <div class="ti-column" v-if="showProgress">{{ status }}</div>
      <div class="ti-column ti-command-column">
        <button
          v-if="mode === 'folder'"
          class="command-button"
          title="mark as Sample"
        >
          <Icon tag="span" size="1em" class="command-button">
            <RuleFolderOutlined />
          </Icon>
        </button>

        <button v-if="mode === 'video'" class="command-button" title="remove">
          <Icon tag="span" size="1em" class="command-button">
            <EditOutlined />
          </Icon>
        </button>

        <button class="command-button" title="remove" @click="onRemoveFileItem">
          <Icon tag="span" size="1em" class="command-button">
            <CancelOutlined />
          </Icon>
        </button>
      </div>

      <!-- candidates here -->
      <u-tree-item-editor v-if="candidates.length > 1" :item="item" />

      <u-tree-item-action :item="item" :level="level" />
      <u-tree-item-action :item="item" :level="level" />
      <u-tree-item-action :item="item" :level="level" />
    </span>
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
  RemoveCircleOutlineFilled,
  SettingsOutlined,
  CancelOutlined,
  EditOutlined,
  RuleFolderOutlined,
} from "@v2icons/material";
import { Icon } from "@v2icons/utils";
import path from "path";
import { FileSystemItem } from "../model/file-item";
import store from "@/store";
import { SettingsModule } from "@/store/settings";

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
    RemoveCircleOutlineFilled,
    SettingsOutlined,
    CancelOutlined,
    EditOutlined,
    RuleFolderOutlined,
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

  get className() {
    return "ti-status-" + this.item.status;
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

  get status() {
    return this.item.status ?? "";
  }

  get candidates() {
    if (this.item.candidates.length > 1) {
      return this.item.candidates;
    }
    return [];
  }

  get id() {
    return this.item.id;
  }

  get visible() {
    return (
      this.item.mode === "video" ||
      this.item.mode === "folder" ||
      !SettingsModule.showVideoOnly
    );
  }

  titleClick() {
    if (this.item) {
      this.item.expanded = !this.item.expanded;
    }
  }

  onRemoveFileItem() {
    store.commit("workset/removeFileItem", this.id);
  }
}
</script>
