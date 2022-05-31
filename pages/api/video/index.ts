import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import getVideoStream from './_getVideoStream';
import postVideoStream from './_postVideoStream';

type Data = {
	movieList: string[];
};

export const config = {
	api: {
		bodyParser: false,
	},
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method == 'GET') {
		return getVideoStream(req, res);
	}

	if (req.method == 'POST') {
		return postVideoStream(req, res);
	}
}
