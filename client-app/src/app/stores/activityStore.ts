import { makeAutoObservable, runInAction } from "mobx";
import agent from "./../api/agent";
import { Activity, ActivityFormValues } from "./../models/activity";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

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
		const user = store.userStore.user;
		if (user) {
			activity.isGoing = activity.attendees!.some(
				(a) => a.username === user.username
			);
			activity.isHost = activity.hostUsername === user.username;
			activity.host = activity.attendees?.find(
				(a) => a.username === activity.hostUsername
			);
		}
		activity.date = new Date(activity.date!);
		this.activityRegistry.set(activity.id, activity);
	};

	setLoading = (state: boolean) => {
		this.loading = state;
	};

	createActivity = async (activity: ActivityFormValues) => {
		const user = store.userStore.user;
		const attendee = new Profile(user!);
		try {
			await agent.Activities.create(activity);
			const newActivity = new Activity(activity);
			newActivity.hostUsername = user!.username;
			newActivity.attendees = [attendee];
			this.setActivity(newActivity);
			runInAction(() => {
				this.selectedActivity = newActivity;
			});
		} catch (error) {
			console.log(error);
		}
	};

	updateActivity = async (activity: ActivityFormValues) => {
		this.submitting = true;
		try {
			await agent.Activities.update(activity);
			runInAction(() => {
				if (activity.id) {
					let updatedActivity = {
						...this.getActivity(activity.id),
						...activity,
					};
					this.activityRegistry.set(activity.id, updatedActivity as Activity);
					this.selectedActivity = updatedActivity as Activity;
				}
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

	updateAttendance = async () => {
		const user = store.userStore.user;
		this.submitting = true;
		try {
			await agent.Activities.attend(this.selectedActivity!.id);
			runInAction(() => {
				if (this.selectedActivity?.isGoing) {
					this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
						(a) => a.username !== user?.username
					);
					this.selectedActivity.isGoing = false;
				} else {
					const attendee = new Profile(user!);
					this.selectedActivity?.attendees?.push(attendee);
					this.selectedActivity!.isGoing = true;
				}
				this.activityRegistry.set(
					this.selectedActivity!.id,
					this.selectedActivity!
				);
			});
		} catch (error) {
			console.log(error);
		} finally {
			runInAction(() => (this.submitting = false));
		}
	};

	cancelActivityToogle = async () => {
		this.submitting = true;
		try {
			await agent.Activities.attend(this.selectedActivity!.id);
			runInAction(() => {
				this.selectedActivity!.isCanceled = !this.selectedActivity?.isCanceled;
				this.activityRegistry.set(
					this.selectedActivity!.id,
					this.selectedActivity!
				);
			});
		} catch (error) {
			console.log(error);
		} finally {
			runInAction(() => (this.submitting = false));
		}
	};

	updateActivitiesWhenProfileUpdated = (profile: Profile) => {
		this.activityRegistry.forEach((activity) => {
			if (activity.hostUsername === profile.username) {
				activity.host = profile;
			}
			for (let i = 0; i < activity.attendees!.length; i++) {
				if (
					activity.attendees &&
					activity.attendees[i].username === profile.username
				) {
					activity.attendees[i] = profile;
				}
			}
			if (activity.id === this.selectedActivity?.id) {
				this.selectedActivity = activity;
			}
		});
	};

	restoreData = () => {
		this.activityRegistry = new Map<string, Activity>();
		this.selectedActivity = undefined;
		this.editMode = false;
		this.loading = false;
		this.submitting = false;
	};

	clearSelectedActivity = () => {
		this.selectedActivity = undefined;
	};
}
