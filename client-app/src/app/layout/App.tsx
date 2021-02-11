import React, { useEffect } from "react";
import "./styles.css";
import { Container } from "semantic-ui-react";
import NavBar from "./../../features/nav/NavBar";
import ActivityDashboard from "./../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "./../stores/store";
import { observer } from "mobx-react-lite";

const App = () => {
	const { activityStore } = useStore();

	useEffect(() => {
		activityStore.loadActivities();
	}, []);

	if (activityStore.loading)
		return <LoadingComponent inverted={true} content='Loading activities' />;

	return (
		<>
			<NavBar />
			<Container style={{ marginTop: "7em" }}>
				<ActivityDashboard />
			</Container>
		</>
	);
};

export default observer(App);
