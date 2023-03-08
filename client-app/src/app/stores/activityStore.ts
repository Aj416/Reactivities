import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";

export default class ActivitySore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  editMode: boolean = false;
  loading = false;
  initialLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialLoading = (state: boolean) => {
    this.initialLoading = state;
  };

  setActivities = async () => {
    const list = await agent.Activities.list();
    runInAction(() => {
      list.forEach((item) => {
        item.date = item.date.split("T")[0];
      });
      this.activities = [...list];
    });
  };

  setActivity = async (id: string) => {
    const result = await agent.Activities.detail(id);
    result.date = result.date.split("T")[0];
    runInAction(() => (this.selectedActivity = result));
  };

  loadActivities = async () => {
    try {
      await this.setActivities();
    } catch (error) {
      console.log(error);
    } finally {
      this.setInitialLoading(false);
    }
  };

  selectActivity = async (id: string) => {
    try {
      await this.setActivity(id);
    } catch (error) {
      console.log(error);
    } finally {
      // added by me
      runInAction(() => {
        this.editMode = false;
      });
    }
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = async (id?: string) => {
    id ? await this.selectActivity(id) : this.cancelSelectedActivity();
    runInAction(() => (this.editMode = true));
  };

  closeForm = () => {
    this.editMode = false;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      await this.setActivities();
      runInAction(() => {
        this.selectedActivity = activity;
        this.editMode = false;
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
        this.editMode = false;
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
      runInAction(() => {
        if (this.selectedActivity?.id === id) {
          this.cancelSelectedActivity();
          this.editMode = false;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };
}
