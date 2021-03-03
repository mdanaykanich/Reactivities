import { makeAutoObservable, runInAction } from "mobx";
import agent from "./../api/agent";
import { Activity } from "./../models/activity";
import { format } from "date-fns";

export default class ActivityStore {
	constructor() {
		makeAutoObservable(this);
	}
	activityRegistry = new Map<string, Activity>();
	selectedActivity: Activity | undefined = undefined;
	editMode = false;
	loading = false;
	submitting = false;

	get activitiesByDate() {
		return Array.from(this.activityRegistry.values()).sort(
			(a, b) => a.date!.getTime() - b.date!.getTime()
		);
	}

	get groupedActivities() {
		return Object.entries(
			this.activitiesByDate.reduce((activities, activity) => {
				const date = format(activity.date!, "dd MMM yyyy");
				activities[date] = activities[date]
					? [...activities[date], activity]
					: [activity];
				return activities;
			}, {} as { [key: string]: Activity[] })
		);
	}

	loadActivities = async () => {
		this.loading = true;
		try {
			const activities = await agent.Activities.list();
			activities.forEach((activity: Activity) => {
				this.setActivity(activity);
			});
			this.setLoading(false);
		} catch (error) {
			console.log(error);
			this.setLoading(false);
		}
	};

	loadActivity = async (id: string) => {
		let activity = this.getActivity(id);
		if (activity) {
			this.selectedActivity = activity;
			return activity;
		} else {
			this.loading = true;
			try {
				activity = await agent.Activities.details(id);
				this.setActivity(activity!);
				runInAction(() => {
					this.selectedActivity = activity;
				});
				this.setLoading(false);
				return activity;
			} catch (error) {
				console.log(error);
				this.setLoading(false);
			}
		}
	};

	private getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	};

	private setActivity = (activity: Activity) => {
		activity.date = new Date(activity.date!);
		this.activityRegistry.set(activity.id, activity);
	};

	setLoading = (state: boolean) => {
		this.loading = state;
	};

	createActivity = async (activity: Activity) => {
		this.submitting = true;
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
