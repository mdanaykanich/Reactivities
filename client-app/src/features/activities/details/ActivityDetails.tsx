import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "./../../../app/layout/LoadingComponent";
import { useStore } from "./../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

const ActivityDetails = () => {
	const { activityStore } = useStore();
	const {
		selectedActivity: activity,
		loadActivity,
		loading,
		clearSelectedActivity,
	} = activityStore;
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (id) {
			loadActivity(id);
		}
		return () => {
			clearSelectedActivity();
		};
	}, [id, loadActivity, clearSelectedActivity]);

	if (!activity || loading)
		return <LoadingComponent inverted={true} content='Loading activity' />;

	return (
		<Grid>
			<Grid.Column width='10'>
				<ActivityDetailedHeader activity={activity} />
				<ActivityDetailedInfo activity={activity} />
				<ActivityDetailedChat activityId={activity.id} />
			</Grid.Column>
			<Grid.Column width='6'>
				<ActivityDetailedSidebar activity={activity} />
			</Grid.Column>
		</Grid>
	);
};

export default observer(ActivityDetails);
