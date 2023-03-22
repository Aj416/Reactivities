import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Credentials, User } from "../models/user";
import { router } from "../router/routes";
import { store } from "./store";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedin() {
    return !!this.user;
  }

  login = async (credential: Credentials) => {
    try {
      const user = await agent.Account.login(credential);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      store.modalStore.closeModal();
      router.navigate("/activities");
    } catch (error) {
      throw error;
    }
  };

  register = async (credential: Credentials) => {
    try {
      const user = await agent.Account.register(credential);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      store.modalStore.closeModal();
      router.navigate("/activities");
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.user = null;
    router.navigate("/");
  };

  getUser = async () => {
    try {
      const data = await agent.Account.current();
      runInAction(() => (this.user = data));
    } catch (error) {
      console.log(error);
    }
  };

  setImage = (mainImage: string) => {
    if (this.user) this.user.image = mainImage;
  };
}
