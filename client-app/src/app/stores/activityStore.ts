import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { format } from "date-fns";
import { store } from "./store";
import { ActivityFormValues } from "../models/activity";

export default class ActivitySore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  loading = false;
  initialLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialLoading = (state: boolean) => {
    this.initialLoading = state;
  };

  private setActivity = (activity: Activity) => {
    const userEntity = store.userStore.user;
    if (userEntity) {
      activity.isGoing = activity.attendees!.some(
        (x) => x.userName === userEntity.userName
      );
      activity.isHost = activity.hostUserName === userEntity.userName;
      activity.host = activity.attendees!.find(
        (x) => x.userName === activity.hostUserName
      );
    }
    activity.date = new Date(activity.date!);
  };

  private setActivities = async () => {
    const result = await agent.Activities.list();
    runInAction(() => {
      result.forEach((item) => {
        this.setActivity(item);
      });
      this.activities = [...result];
    });
  };

  loadActivity = async (id: string) => {
    this.setInitialLoading(true);
    try {
      const result = await agent.Activities.detail(id);
      this.setActivity(result);

      runInAction(() => (this.selectedActivity = result));
    } catch (error) {
      console.log(error);
    } finally {
      this.setInitialLoading(false);
    }
  };

  loadActivities = async () => {
    this.setInitialLoading(true);
    try {
      await this.setActivities();
    } catch (error) {
      console.log(error);
    } finally {
      this.setInitialLoading(false);
    }
  };

  createActivity = async (activity: ActivityFormValues) => {
    this.loading = true;
    try {
      await agent.Activities.create(activity);
      await this.loadActivity(activity.id!);
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      await this.loadActivity(activity.id!);
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      await this.setActivities();
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  getActivity = async (id: string) => {
    this.initialLoading = true;
    try {
      await this.loadActivity(id);
    } catch (error) {
      console.log(error);
    } finally {
      this.setInitialLoading(false);
      return this.selectedActivity;
    }
  };

  get groupedActivities() {
    return Object.entries(
      this.activities.reduce((result, item) => {
        const date = format(new Date(item.date!), "dd MMM yyyy");
        result[date] = result[date] ? [...result[date], item] : [item];
        return result;
      }, {} as { [key: string]: Activity[] })
    );
  }

  updateAttedance = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      await this.loadActivity(this.selectedActivity!.id);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity?.isCancelled;
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  };
}
