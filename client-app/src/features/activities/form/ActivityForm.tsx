import React, { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "./../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useHistory, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity } from "../../../app/models/activity";

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

	const [activity, setActivity] = useState<Activity>({
		id: "",
		title: "",
		category: "",
		description: "",
		date: null,
		city: "",
		venue: "",
	});

	const validationSchema = Yup.object({
		title: Yup.string().required("The activity title is required"),
		description: Yup.string().required("The activity description is required"),
		category: Yup.string().required(),
		date: Yup.string().required("Date is required").nullable(),
		city: Yup.string().required(),
		venue: Yup.string().required(),
	});

	useEffect(() => {
		if (id) {
			loadActivity(id).then((activity) => setActivity(activity!));
		}
	}, [id, loadActivity]);

	const handleFormSubmit = (activity: Activity) => {
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
			<Header content='Activity Details' sub color='teal' />
			<Formik
				enableReinitialize
				initialValues={activity}
				onSubmit={(values) => handleFormSubmit(values)}
				validationSchema={validationSchema}
			>
				{({ handleSubmit, isValid, isSubmitting, dirty }) => (
					<Form className='ui form' onSubmit={handleSubmit}>
						<MyTextInput name='title' placeholder='Title' />
						<MyTextArea rows={3} name='description' placeholder='Description' />
						<MySelectInput
							options={categoryOptions}
							placeholder='Category'
							name='category'
						/>
						<MyDateInput
							placeholderText='Date'
							name='date'
							showTimeSelect
							timeCaption='time'
							dateFormat='MMMM d, yyyy h:mm aa'
						/>
						<Header content='Location Details' sub color='teal' />
						<MyTextInput placeholder='City' name='city' />
						<MyTextInput placeholder='Venue' name='venue' />
						<Button
							disabled={isSubmitting || !dirty || !isValid}
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
				)}
			</Formik>
		</Segment>
	);
};

export default observer(ActivityForm);
