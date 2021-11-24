<template>
  <div class="app" dropzone="true" @dragover="onDragOver" @drop="onDrop">
    <header class="header">
      <div class="title">uEpisodes</div>
      <u-button title="Add Video File" icon="settings" @click="openFile" />
      <u-button title="Add Folder File" icon="settings" @click="openFolder" />
      <u-button title="settings" icon="settings" @click="settings" />
    </header>
    <router-view class="view-host" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { remote } from "electron";
import { WorksetModule } from "./store/workset";

@Component({ components: {} })
export default class App extends Vue {
  openFile() {
    const results = remote.dialog.showOpenDialogSync({
      title: "Add Video File",
      buttonLabel: "Add",
      properties: ["openFile", "multiSelections"],
    });
    if (results) {
      WorksetModule.addFiles(results);
    }
  }
  openFolder() {
    const results = remote.dialog.showOpenDialogSync({
      title: "Add Video File",
      buttonLabel: "Add",
      properties: ["openDirectory", "multiSelections"],
    });
    if (results) {
      WorksetModule.addFiles(results);
    }
  }

  onDragOver(e: DragEvent) {
    //console.info(e);
    e.preventDefault();
  }
  onDrop(e: DragEvent) {
    e.preventDefault();

    const files: string[] = [];

    if (e.dataTransfer) {
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === "file") {
            var file = e.dataTransfer.items[i].getAsFile();
            if (file) {
              files.push(file.path);
            }
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const file = e.dataTransfer.files[i];
          if (file) {
            files.push(file.path);
          }
        }
      }
    }

    if (files.length > 0) {
      WorksetModule.addFiles(files);
    }
  }

  settings() {
    this.$router.replace("about");
  }
}
</script>

<style lang="less">
@import "./style/app.less";
</style>
