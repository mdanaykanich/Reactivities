import { observer } from "mobx-react-lite";
import React from "react";
import { Header, Item, Segment, Image, Button, Label } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

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

	const {
		activityStore: { updateAttendance, submitting, cancelActivityToogle },
	} = useStore();

	return (
		<Segment.Group>
			<Segment basic attached='top' style={{ padding: "0" }}>
				{activity.isCanceled && (
					<Label
						style={{ position: "absolute", zIndex: 10, left: -14, top: 20 }}
						ribbon
						color='red'
						content='Canceled'
					/>
				)}
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
									Hosted by{" "}
									<strong>
										<Link to={`/profiles/${activity.host?.username}`}>
											{activity.host?.displayName}
										</Link>
									</strong>
								</p>
							</Item.Content>
						</Item>
					</Item.Group>
				</Segment>
			</Segment>
			<Segment clearing attached='bottom'>
				{activity.isHost ? (
					<>
						<Button
							color={activity.isCanceled ? "green" : "red"}
							floated='left'
							basic
							content={
								activity.isCanceled ? "Re-activate Activity" : "Cancel Activity"
							}
							onClick={cancelActivityToogle}
							loading={submitting}
						/>
						<Button
							disabled={activity.isCanceled}
							as={Link}
							to={`/manage/${activity.id}`}
							color='orange'
							floated='right'
						>
							Manage Event
						</Button>
					</>
				) : activity.isGoing ? (
					<Button loading={submitting} onClick={updateAttendance}>
						Cancel attendance
					</Button>
				) : (
					<Button
						disabled={activity.isCanceled}
						loading={submitting}
						color='teal'
						onClick={updateAttendance}
					>
						Join Activity
					</Button>
				)}
			</Segment>
		</Segment.Group>
	);
};

export default observer(ActivityDetailedHeader);
