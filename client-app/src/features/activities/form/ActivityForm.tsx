import React, { FormEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/layout/models/activity";
import { v4 as uuid } from "uuid";

interface IProps {
	activity: IActivity;
	setEditMode: (editMode: boolean) => void;
	createActivity: (activity: IActivity) => void;
	editActivity: (activity: IActivity) => void;
	submitting: boolean;
}

const ActivityForm: React.FC<IProps> = ({
	activity: initialFormState,
	setEditMode,
	createActivity,
	editActivity,
	submitting,
}) => {
	const initForm = () => {
		if (initialFormState) {
			return initialFormState;
		} else {
			return {
				id: "",
				title: "",
				description: "",
				category: "",
				date: "",
				city: "",
				venue: "",
			};
		}
	};

	const [activity, setActivity] = useState<IActivity>(initForm);

	const handleInputChange = (
		event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.currentTarget;
		setActivity({ ...activity, [name]: value });
	};

	const handleSubmit = () => {
		if (activity.id.length === 0) {
			let newActivity = {
				...activity,
				id: uuid(),
			};
			createActivity(newActivity);
		} else {
			editActivity(activity);
		}
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
					onClick={() => setEditMode(false)}
					floated='right'
					type='submit'
					content='Cancel'
				/>
			</Form>
		</Segment>
	);
};

export default ActivityForm;
