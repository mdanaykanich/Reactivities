import React, { FormEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "./../../../app/stores/store";
import { observer } from "mobx-react-lite";

const ActivityForm = () => {
	const { activityStore } = useStore();
	const {
		selectedActivity,
		closeForm,
		createActivity,
		updateActivity,
		submitting,
	} = activityStore;

	const initialState = selectedActivity ?? {
		id: "",
		title: "",
		category: "",
		description: "",
		date: "",
		city: "",
		venue: "",
	};

	const [activity, setActivity] = useState(initialState);

	const handleInputChange = (
		event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.currentTarget;
		setActivity({ ...activity, [name]: value });
	};

	const handleSubmit = () => {
		activity.id ? updateActivity(activity) : createActivity(activity);
	};

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
					onClick={closeForm}
					floated='right'
					type='submit'
					content='Cancel'
				/>
			</Form>
		</Segment>
	);
};

export default observer(ActivityForm);
