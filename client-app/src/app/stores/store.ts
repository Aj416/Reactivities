import { createContext, useContext } from "react";
import ActivitySore from "./activityStore";

interface Store {
  activityStore: ActivitySore;
}

export const store: Store = {
  activityStore: new ActivitySore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
