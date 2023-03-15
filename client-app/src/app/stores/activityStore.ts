import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { format } from "date-fns";

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

  private setActivities = async () => {
    const list = await agent.Activities.list();
    runInAction(() => {
      list.forEach((item) => {
        item.date = new Date(item.date!);
      });
      this.activities = [...list];
    });
  };

  loadActivity = async (id: string) => {
    this.setInitialLoading(true);
    try {
      const result = await agent.Activities.detail(id);
      console.log(new Date(result.date!.toLocaleString()));
      result.date = new Date(result.date!);

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

  createActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.create(activity);
      await this.setActivities();
      runInAction(() => {
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      await this.setActivities();
      runInAction(() => {
        this.selectedActivity = activity;
      });
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
}
