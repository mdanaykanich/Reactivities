import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { store } from "../stores/store";
import { Activity } from "./../models/activity";

axios.defaults.baseURL = "http://localhost:5000/api";

const sleep = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};

axios.interceptors.response.use(
	async (response) => {
		await sleep(1000);
		return response;
	},
	(error: AxiosError) => {
		const { data, status, config } = error.response!;
		switch (status) {
			case 400:
				if (typeof data === "string") {
					toast.error(data);
				}
				if (config.method === "get" && data.errors.hasOwnProperty("id")) {
					history.push("/not-found");
				}
				if (data.errors) {
					const modalStateErrors = [];
					for (const key in data.errors) {
						if (data.errors[key]) {
							modalStateErrors.push(data.errors[key]);
						}
					}
					throw modalStateErrors.flat();
				} else {
					toast.error(data);
				}
				break;
			case 401:
				toast.error("unauthorized");
				break;
			case 404:
				history.push("/not-found");
				break;
			case 500:
				store.commonStore.setServerError(data);
				history.push("/server-error");
				break;
		}
		return Promise.reject(error);
	}
);

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string) => axios.get(url).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
	delete: (url: string) => axios.delete(url).then(responseBody),
};

const Activities = {
	list: (): Promise<Activity[]> => requests.get("/activities"),
	details: (id: string) => requests.get(`/activities/${id}`),
	create: (activity: Activity) => requests.post("/activities", activity),
	update: (activity: Activity) =>
		requests.put(`/activities/${activity.id}`, activity),
	delete: (id: string) => requests.delete(`/activities/${id}`),
};

export default {
	Activities,
};
