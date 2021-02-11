import React from "react";
import { Button, Image } from "semantic-ui-react";
import Card from "semantic-ui-react/dist/commonjs/views/Card";
import LoadingComponent from "./../../../app/layout/LoadingComponent";
import { useStore } from "./../../../app/stores/store";

const ActivityDetails = () => {
	const { activityStore } = useStore();
	const {
		selectedActivity: activity,
		openForm,
		cancelSelectedActivity,
	} = activityStore;
	if (!activity) return <LoadingComponent />;

	return (
		<Card>
			<Image
				src={`/assets/categoryImages/${activity.category}.jpg`}
				wrapped
				ui={false}
			/>
			<Card.Content>
				<Card.Header>{activity.title}</Card.Header>
				<Card.Meta>
					<span>{activity.date}</span>
				</Card.Meta>
				<Card.Description>{activity.description}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button.Group widths={2}>
					<Button
						onClick={() => openForm(activity.id)}
						basic
						color='blue'
						content='Edit'
					/>
					<Button
						onClick={() => cancelSelectedActivity()}
						basic
						color='red'
						content='Cancel'
					/>
				</Button.Group>
			</Card.Content>
		</Card>
	);
};

export default ActivityDetails;
