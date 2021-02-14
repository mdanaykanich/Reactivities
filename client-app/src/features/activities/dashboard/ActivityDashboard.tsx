import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "./../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "./../../../app/layout/LoadingComponent";

const ActivityDashboard = () => {
	const { activityStore } = useStore();
	const { loadActivities, activityRegistry } = activityStore;

	useEffect(() => {
		if (activityRegistry.size <= 1) loadActivities();
	}, [activityRegistry.size, loadActivities]);

	if (activityStore.loading)
		return <LoadingComponent inverted={true} content='Loading activities' />;

	return (
		<Grid>
			<Grid.Column width={10}>
				<ActivityList />
			</Grid.Column>
			<Grid.Column width={6}>
				<h2>Activity filters</h2>
			</Grid.Column>
		</Grid>
	);
};

export default observer(ActivityDashboard);
