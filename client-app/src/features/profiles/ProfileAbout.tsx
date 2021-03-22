import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form, Grid, Header, Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { observer } from "mobx-react-lite";

interface Props {
	profile: Profile;
}

const ProfileAbout = ({ profile }: Props) => {
	const [editProfile, setEditProfile] = useState(false);
	const {
		profileStore: { isCurrentUser, updateProfile },
		activityStore: { updateActivitiesWhenProfileUpdated },
	} = useStore();

	const validationSchema = Yup.object({
		displayName: Yup.string().required("Display Name is required"),
	});

	const handleFormSubmit = (profile: Profile) => {
		updateProfile(profile).then(() => setEditProfile(!editProfile));
		updateActivitiesWhenProfileUpdated(profile);
	};

	return (
		<Tab.Pane>
			<Grid>
				<Grid.Column width='16'>
					<Header
						floated='left'
						icon='user'
						content={`About ${profile?.displayName}`}
					/>
					{isCurrentUser && (
						<Button
							floated='right'
							basic
							content={editProfile ? "Cancel" : "Edit Profile"}
							onClick={() => setEditProfile(!editProfile)}
						/>
					)}
				</Grid.Column>
				<Grid.Column width='16'>
					{editProfile ? (
						<Formik
							enableReinitialize
							initialValues={profile}
							onSubmit={(values) => handleFormSubmit(values)}
							validationSchema={validationSchema}
						>
							{({ handleSubmit, isValid, isSubmitting, dirty }) => (
								<Form className='ui form' onSubmit={handleSubmit}>
									<MyTextInput name='displayName' placeholder='Display Name' />
									<MyTextArea rows={3} name='bio' placeholder='Add your bio' />
									<Button
										disabled={isSubmitting || !dirty || !isValid}
										loading={isSubmitting}
										floated='right'
										positive
										type='submit'
										content='Submit'
									/>
								</Form>
							)}
						</Formik>
					) : (
						<span style={{ whiteSpace: "pre-wrap" }}>{profile.bio}</span>
					)}
				</Grid.Column>
			</Grid>
		</Tab.Pane>
	);
};

export default observer(ProfileAbout);
