import Vue from "vue";
import Vuex from "vuex";
import { EpGuidesState } from "./epguides";

import { SettingsState } from "./settings";
import { WorksetState } from "./workset";

Vue.use(Vuex);

export interface RootState {
  epguides: EpGuidesState;
  settings: SettingsState;
  workset: WorksetState;
}

const store = new Vuex.Store<RootState>({});

export default store;
