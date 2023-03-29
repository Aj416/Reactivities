import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  followings: Profile[] = [];
  loadingFollowings = false;
  activeTab: number = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.userName === this.profile.userName;
    }

    return false;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const result = await agent.Profiles.get(username);
      runInAction(() => (this.profile = result));
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loadingProfile = false));
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.Profiles.upload(file);
      const photo = response.data;
      if (store.userStore.user) {
        const result = await agent.Profiles.get(store.userStore.user.userName);
        runInAction(() => {
          this.profile = result;
          store.userStore.setImage(photo.url);
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.uploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      if (store.userStore.user) {
        const result = await agent.Profiles.get(store.userStore.user.userName);
        runInAction(() => (this.profile = result));
      }
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      if (store.userStore.user) {
        const result = await agent.Profiles.get(store.userStore.user.userName);
        runInAction(() => (this.profile = result));
      }
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  updateProfile = async (profile: Partial<Profile>) => {
    this.loading = true;
    try {
      await agent.Profiles.editProfile(profile);
      if (store.userStore.user) {
        const result = await agent.Profiles.get(store.userStore.user.userName);
        runInAction(() => {
          this.profile = result;
          store.userStore.user!.displayName = result.displayName;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  updateFollowing = async (username: string) => {
    this.loading = true;

    try {
      await agent.Profiles.updateFollowing(username);

      const profileResult = await agent.Profiles.get(this.profile!.userName);

      const activitiesResult = await agent.Activities.list();
      runInAction(() => {
        this.profile = profileResult;

        activitiesResult.forEach((item) => {
          store.activityStore.setActivity(item);
        });
        store.activityStore.activities = [...activitiesResult];
        this.followings.forEach((item) => {
          if (item.userName === username) {
            item.following = !item.following;
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loadingFollowings = true;
    try {
      const result = await agent.Profiles.listFollowing(
        this.profile!.userName,
        predicate
      );
      runInAction(() => (this.followings = result));
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loadingFollowings = false));
    }
  };
}
