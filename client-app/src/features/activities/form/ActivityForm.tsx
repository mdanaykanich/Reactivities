import React, { FormEvent, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "./../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useHistory, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";

const ActivityForm = () => {
	const { activityStore } = useStore();
	const {
		createActivity,
		updateActivity,
		submitting,
		loadActivity,
		loading,
	} = activityStore;
	const { id } = useParams<{ id: string }>();
	const history = useHistory();

	const [activity, setActivity] = useState({
		id: "",
		title: "",
		category: "",
		description: "",
		date: "",
		city: "",
		venue: "",
	});

	useEffect(() => {
		if (id) {
			loadActivity(id).then((activity) => setActivity(activity!));
		}
	}, [id, loadActivity]);

	const handleInputChange = (
		event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.currentTarget;
		setActivity({ ...activity, [name]: value });
	};

	const handleSubmit = () => {
		if (activity.id.length === 0) {
			let newActivity = { ...activity, id: uuid() };
			createActivity(newActivity).then(() => {
				history.push(`/activities/${newActivity.id}`);
			});
		} else {
			updateActivity(activity).then(() => {
				history.push(`/activities/${activity.id}`);
			});
		}
	};

	if (loading)
		return <LoadingComponent inverted={true} content='Loading activity' />;

	return (
		<Segment clearing>
			<Form onSubmit={handleSubmit}>
				<Form.Input
					onChange={handleInputChange}
					name='title'
					placeholder='Title'
					value={activity.title}
				/>
				<Form.TextArea
					onChange={handleInputChange}
					rows={2}
					name='description'
					placeholder='Description'
					value={activity.description}
				/>
				<Form.Input
					onChange={handleInputChange}
					placeholder='Category'
					value={activity.category}
					name='category'
				/>
				<Form.Input
					onChange={handleInputChange}
					type='datetime-local'
					placeholder='Date'
					value={activity.date}
					name='date'
				/>
				<Form.Input
					onChange={handleInputChange}
					placeholder='City'
					value={activity.city}
					name='city'
				/>
				<Form.Input
					onChange={handleInputChange}
					placeholder='Venue'
					value={activity.venue}
					name='venue'
				/>
				<Button
					loading={submitting}
					floated='right'
					positive
					type='submit'
					content='Submit'
				/>
				<Button
					as={Link}
					to={"/activities"}
					floated='right'
					type='submit'
					content='Cancel'
				/>
			</Form>
		</Segment>
	);
};

export default observer(ActivityForm);
