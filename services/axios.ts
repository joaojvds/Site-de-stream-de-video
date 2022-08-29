import axios from 'axios';

export async function getItemsList(
	setState?: React.Dispatch<React.SetStateAction<string[]>>
) {
	try {
		const response = await axios.get('/api');
		if (setState) setState(response.data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
}

type Info = {
	id: string;
	title: string;
	description: string;
	rating: string;
	duration: string;
	releaseDate: string;
	videoType: string;
};

export async function getItemInfo(
	videoID: string,
	setState?: React.Dispatch<React.SetStateAction<Info>>
) {
	try {
		const response = await axios.get<Info>(`/api/${videoID}`);
		if (setState) setState(response.data);
		return response.data;
	} catch (error) {
		if (setState) setState(null);
		console.log(error);
	}
}
