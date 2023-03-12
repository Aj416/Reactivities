import { createContext, useContext } from "react";
import ActivitySore from "./activityStore";
import CommonStore from "./commonStore";

interface Store {
  activityStore: ActivitySore;
  commonStore: CommonStore;
}

export const store: Store = {
  activityStore: new ActivitySore(),
  commonStore: new CommonStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
