import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

type Data = {
	movieList: string[];
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	fs.readdir('./videos', (err, files) => {
		res.status(200).json({ movieList: files });
	});
}
