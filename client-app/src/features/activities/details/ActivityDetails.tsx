import React from "react";
import { Button, Image } from "semantic-ui-react";
import Card from "semantic-ui-react/dist/commonjs/views/Card";
import { Activity } from "./../../../app/models/activity";

interface Props {
	activity: Activity;
	setEditMode: (editMode: boolean) => void;
	setSelectedActivity: (activity: Activity | null) => void;
}

const ActivityDetails = ({
	activity,
	setEditMode,
	setSelectedActivity,
}: Props) => {
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
						onClick={() => setEditMode(true)}
						basic
						color='blue'
						content='Edit'
					/>
					<Button
						onClick={() => setSelectedActivity(null)}
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
