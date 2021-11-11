<template>
  <div class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-section-header">
        <div>Monitor uTorrent</div>
        <Icon size="16" class="button">
          <SettingsOutlined />
        </Icon>
      </div>
      <div class="sidebar-section-item" style="color: red">
        <div>torrent item here</div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-header">Monitor Folders</div>
      <div class="sidebar-section-item">
        <div>folder item 01</div>
      </div>
      <div class="sidebar-section-item">
        <div>folder item 02</div>
      </div>
      <div class="sidebar-section-item">
        <div>folder item 03</div>
      </div>
      <div class="sidebar-section-item">
        <div>folder item 04</div>
      </div>
      <div class="sidebar-section-item">
        <div>folder item 05</div>
      </div>
    </div>

    <div class="spacer"></div>

    <router-link to="/">Home 2</router-link> |
    <router-link to="/about">About</router-link>
    <div>{{ settingsVersion }}</div>
    <div>{{ r }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AddCircleOutlineRound, SettingsOutlined } from "@v2icons/material";
import { Icon } from "@v2icons/utils";
import { SettingsModule } from "../store/settings";

@Component({ components: { AddCircleOutlineRound, SettingsOutlined, Icon } })
export default class Sidebar extends Vue {
  get settingsVersion() {
    return SettingsModule.data.version;
  }
  get r() {
    //const rr = ipcRenderer.invoke;
    return "remote.screen.getPrimaryDisplay().size.toString();";
  }
}
</script>
