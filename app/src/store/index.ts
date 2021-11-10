import Vue from "vue";
import Vuex from "vuex";
import { EpGuidesState } from "./epguides";

Vue.use(Vuex);

export interface RootState {
  epguides: EpGuidesState;
}

const store = new Vuex.Store<RootState>({});

export default store;