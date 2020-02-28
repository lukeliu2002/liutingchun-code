import axios from 'axios';
import { API_BASE_PATH, MSG_UNEXPECTED_ERROR } from '@/constants';

const getRoute = (token) => {
	const path = `${API_BASE_PATH}/route/${token}`;

	return new Promise((resolve, reject) => {
		axios.get(path)
			.then(response => {
				const data = response.data;

				if (data.status === 'success') {
					resolve({
						path: data.path,
						totalDistance: data.total_distance,
						totalTime: data.total_time
					});
				}
				else if (data.status === 'in progress') {
					reject({
						status: 'timeout'
					})
				}
				else if (data.status === 'failure') {
					reject({
						status: 'failure',
						message: data.error
					})
				}
				else {
					reject({
						status: 'failure',
						message: MSG_UNEXPECTED_ERROR
					})
				}
			})
			.catch(() => {
				reject({
					status: 'failure',
					message: MSG_UNEXPECTED_ERROR
				})
			})
	})
}

const postRoute = async (origin, destination) => {
	const path = `${API_BASE_PATH}/route`;

	return new Promise((resolve, reject) => {
		axios.post(path, { origin, destination })
			.then(response => {
				resolve(response.data);			
			})
			.catch(() => {
				reject({
					status: 'failure',
					message: MSG_UNEXPECTED_ERROR
				})
			})
	})
}

export {
	getRoute,
	postRoute
}