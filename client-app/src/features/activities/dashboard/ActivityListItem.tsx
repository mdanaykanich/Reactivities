import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";

interface Props {
	activity: Activity;
}

const ActivityListItem = ({ activity }: Props) => (
	<Segment.Group>
		<Segment>
			<Item.Group>
				<Item>
					<Item.Image size='tiny' circular src='/assets/user.png' />
					<Item.Content>
						<Item.Header as={Link} to={`/activities/${activity.id}`}>
							{activity.title}
						</Item.Header>
						<Item.Description>Hosted by Bob</Item.Description>
					</Item.Content>
				</Item>
			</Item.Group>
		</Segment>
		<Segment>
			<span>
				<Icon name='clock' /> {format(activity.date!, "dd MMM yyyy h:mm aa")}
				<br />
				<Icon name='marker' /> {activity.venue}, {activity.city}
			</span>
		</Segment>
		<Segment secondary>Attendees go here</Segment>
		<Segment clearing>
			<span>
				{activity.description}
				<Button
					as={Link}
					to={`/activities/${activity.id}`}
					color='teal'
					floated='right'
					content='View'
				/>
			</span>
		</Segment>
	</Segment.Group>
);

export default ActivityListItem;
