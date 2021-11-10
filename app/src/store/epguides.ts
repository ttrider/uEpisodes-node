import { getModule, Module, VuexModule } from "vuex-module-decorators";
import store from "@/store";

export interface EpGuidesState {
  catalog: string;
}

@Module({ dynamic: true, store, name: "epguides", namespaced: true })
class EpGuides extends VuexModule implements EpGuidesState {
  catalog = "catalog";

  // @Mutation initialize(items: ItemSet<CompanyRecord>) {
  //   const cmap = mapItemSet(items, (item) => new Company(item));
  //   this.items = cmap;
  // }

  // @Mutation update(items: ItemSet<CompanyRecord>) {
  //   const cmap = mapItemSet(items, (item) => new Company(item));
  //   mergeItemSets(this.items, cmap);
  // }
}

export const EpGuidesModule = getModule(EpGuides);
