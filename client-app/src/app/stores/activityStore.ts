import { makeAutoObservable, runInAction } from "mobx";
import agent from "./../api/agent";
import { Activity } from "./../models/activity";
import { v4 as uuid } from "uuid";

export default class ActivityStore {
	constructor() {
		makeAutoObservable(this);
	}
	activityRegistry = new Map<string, Activity>();
	selectedActivity: Activity | undefined = undefined;
	editMode = false;
	loading = true;
	submitting = false;

	get activitiesByDate() {
		return Array.from(this.activityRegistry.values()).sort(
			(a, b) => Date.parse(a.date) - Date.parse(b.date)
		);
	}

	loadActivities = async () => {
		try {
			const activities = await agent.Activities.list();
			activities.forEach((activity) => {
				activity.date = activity.date.split(".")[0];
				this.activityRegistry.set(activity.id, activity);
			});
			this.setLoading(false);
		} catch (error) {
			console.log(error);
			this.setLoading(false);
		}
	};

	setLoading = (state: boolean) => {
		this.loading = state;
	};

	selectActivity = (id: string) => {
		this.selectedActivity = this.activityRegistry.get(id);
	};

	cancelSelectedActivity = () => {
		this.selectedActivity = undefined;
	};

	openForm = (id?: string) => {
		id ? this.selectActivity(id) : this.cancelSelectedActivity();
		this.editMode = true;
	};

	closeForm = () => {
		this.editMode = false;
	};

	createActivity = async (activity: Activity) => {
		this.submitting = true;
		activity.id = uuid();
		try {
			await agent.Activities.create(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.submitting = false;
				this.editMode = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.submitting = false;
			});
		}
	};

	updateActivity = async (activity: Activity) => {
		this.submitting = true;
		try {
			await agent.Activities.update(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.submitting = false;
				this.editMode = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.submitting = false;
			});
		}
	};

	deleteActivity = async (id: string) => {
		this.submitting = true;
		try {
			await agent.Activities.delete(id);
			runInAction(() => {
				this.activityRegistry.delete(id);
				this.submitting = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
