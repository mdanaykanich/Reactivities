import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Image } from "semantic-ui-react";
import Card from "semantic-ui-react/dist/commonjs/views/Card";
import LoadingComponent from "./../../../app/layout/LoadingComponent";
import { useStore } from "./../../../app/stores/store";

const ActivityDetails = () => {
	const { activityStore } = useStore();
	const { selectedActivity: activity, loadActivity, loading } = activityStore;
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (id) {
			loadActivity(id);
		}
	}, [id, loadActivity]);

	if (!activity || loading)
		return <LoadingComponent inverted={true} content='Loading activity' />;

	return (
		<Card fluid>
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
						as={Link}
						to={`/manage/${activity.id}`}
						basic
						color='blue'
						content='Edit'
					/>
					<Button
						as={Link}
						to={"/activities"}
						basic
						color='red'
						content='Cancel'
					/>
				</Button.Group>
			</Card.Content>
		</Card>
	);
};

export default observer(ActivityDetails);
