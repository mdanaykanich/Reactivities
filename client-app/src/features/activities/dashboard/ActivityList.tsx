import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "./../../../app/stores/store";
import { observer } from "mobx-react-lite";

const ActivityList = () => {
	const [target, setTarget] = useState("");
	const { activityStore } = useStore();

	const { deleteActivity, activitiesByDate, submitting } = activityStore;

	const handleDeleteActivity = (
		e: SyntheticEvent<HTMLButtonElement>,
		id: string
	) => {
		setTarget(e.currentTarget.name);
		deleteActivity(id);
	};

	return (
		<Segment clearing>
			<Item.Group divided>
				{activitiesByDate.map((activity) => (
					<Item key={activity.id}>
						<Item.Content>
							<Item.Header as='a'>{activity.title}</Item.Header>
							<Item.Meta>{activity.date.replace("T", " ")}</Item.Meta>
							<Item.Description>
								<div>{activity.description}</div>
								<div>
									{activity.city}, {activity.venue}
								</div>
							</Item.Description>
							<Item.Extra>
								<Button
									onClick={() => activityStore.selectActivity(activity.id)}
									floated='right'
									content='View'
									color='blue'
								/>
								<Button
									name={activity.id}
									loading={target == activity.id && submitting}
									onClick={(e) => handleDeleteActivity(e, activity.id)}
									floated='right'
									content='Delete'
									color='red'
								/>
								<Label basic content={activity.category} />
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		</Segment>
	);
};

export default observer(ActivityList);
