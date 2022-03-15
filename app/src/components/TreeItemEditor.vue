<template>
  <span v-if="item" style="display: contents; font-size: 0.8em">
    <div></div>
    <div class="ti-column">
      <input class="ti-text" :value="showName" @input="showNameChanged" />
    </div>
    <div class="ti-column">
      <input
        class="ti-text"
        :value="season"
        type="number"
        @input="seasonChanged"
      />
    </div>
    <div class="ti-column">
      <input
        class="ti-text"
        :value="episode"
        type="number"
        @input="episodeChanged"
      />
    </div>
    <div class="ti-column">
      <input class="ti-text" :value="episodeName" @input="episodeNameChanged" />
    </div>
    <div></div>
    <div></div>

    <u-tree-item-editor-candidate
      v-for="c in candidates"
      :key="c.id"
      :item="c"
      @click="(e) => onClickCandidate(c)"
    />

    <div class="ti-editor-buttons">
      <div>
        <button @click="onConfirm">Confirm</button>
        <button @click="onReset">Reset</button>
      </div>
    </div>

    <div></div>
    <div></div>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FileSystemItem } from "../model/file-item";
import { ShowEpisodeCandidate } from "uepisodes-modules";

const lookupMetadata: (params: {
  showName: string;
  season: string;
  episode: string;
}) => Promise<ShowEpisodeCandidate[]> = (window as any).lookupMetadata;

@Component({
  components: {},
})
export default class TreeItem extends Vue {
  @Prop() item!: FileSystemItem;

  showNameValue: string | null = null;
  seasonValue: string | null = null;
  episodeValue: string | null = null;
  episodeNameValue: string | null = null;

  lookupCandidatesValue: ShowEpisodeCandidate[] = [];

  get candidates() {
    if (this.lookupCandidatesValue.length > 0) {
      return this.lookupCandidatesValue;
    }
    if (this.item.candidates.length > 1) {
      return this.item.candidates;
    }
    return [];
  }

  get showName() {
    return this.showNameValue != null
      ? this.showNameValue
      : this.item.showName ?? "";
  }
  get season() {
    return this.seasonValue != null
      ? this.seasonValue
      : this.item?.season?.toString() ?? "";
  }
  get episode() {
    return this.episodeValue != null
      ? this.episodeValue
      : this.item?.episode?.toString() ?? "";
  }
  get episodeName() {
    return this.episodeNameValue != null
      ? this.episodeNameValue
      : this.item.episodeName ?? "";
  }

  async showNameChanged(e: InputEvent) {
    this.showNameValue = (e.target as unknown as { value: string }).value;
    this.lookupCandidatesValue = await lookupMetadata({
      showName: this.showName,
      season: this.season,
      episode: this.episode,
    });
    console.info(this.lookupCandidatesValue);
  }
  async seasonChanged(e: InputEvent) {
    this.seasonValue = (e.target as unknown as { value: string }).value;
    this.lookupCandidatesValue = await lookupMetadata({
      showName: this.showName,
      season: this.season,
      episode: this.episode,
    });
    console.info(this.lookupCandidatesValue);
  }
  async episodeChanged(e: InputEvent) {
    this.episodeValue = (e.target as unknown as { value: string }).value;
    this.lookupCandidatesValue = await lookupMetadata({
      showName: this.showName,
      season: this.season,
      episode: this.episode,
    });
    console.info(this.lookupCandidatesValue);
  }
  async episodeNameChanged(e: InputEvent) {
    this.episodeNameValue = (e.target as unknown as { value: string }).value;
  }

  onClickCandidate(candidate: ShowEpisodeCandidate) {
    this.showNameValue = candidate.showName;
    this.seasonValue = candidate.season?.toString() ?? null;
    this.episodeValue = candidate.episode?.toString() ?? null;
    this.episodeNameValue = candidate.episodeName ?? null;
  }

  onConfirm() {
    this.item.showName = this.showNameValue;
    this.item.episodeName = this.episodeNameValue;
    this.item.season = ensureNumber(this.seasonValue);
    this.item.episode = ensureNumber(this.episodeValue);
    this.item.candidates = [];
    this.item.status = "ready";
  }
  onReset() {
    this.showNameValue = null;
    this.episodeNameValue = null;
    this.seasonValue = null;
    this.episodeValue = null;
  }
}
function ensureNumber(value?: string | null) {
  if (value == undefined) {
    return null;
  }
  const val = parseInt(value);
  if (isNaN(val)) {
    return null;
  }
  return val;
}
</script>
