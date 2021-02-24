import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Header, Item, Segment, Image, Button } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";

interface Props {
	activity: Activity;
}

const ActivityDetailedHeader = ({ activity }: Props) => {
	const activityImageStyle = {
		filter: "brightness(30%)",
	};

	const activityImageTextStyle = {
		position: "absolute",
		bottom: "5%",
		left: "5%",
		width: "100%",
		height: "auto",
		color: "white",
	};

	return (
		<Segment.Group>
			<Segment basic attached='top' style={{ padding: "0" }}>
				<Image
					src={`/assets/categoryImages/${activity.category}.jpg`}
					fluid
					style={activityImageStyle}
				/>
				<Segment style={activityImageTextStyle} basic>
					<Item.Group>
						<Item>
							<Item.Content>
								<Header
									size='huge'
									content={activity.title}
									style={{ color: "white" }}
								/>
								<p>{format(activity.date!, "dd MMM yyyy")}</p>
								<p>
									Hosted by <strong>Bob</strong>
								</p>
							</Item.Content>
						</Item>
					</Item.Group>
				</Segment>
			</Segment>
			<Segment clearing attached='bottom'>
				<Button color='teal'>Join Activity</Button>
				<Button>Cancel attendance</Button>
				<Button
					as={Link}
					to={`/manage/${activity.id}`}
					color='orange'
					floated='right'
				>
					Manage Event
				</Button>
			</Segment>
		</Segment.Group>
	);
};

export default observer(ActivityDetailedHeader);
