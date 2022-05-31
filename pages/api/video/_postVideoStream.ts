import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import busboy from 'busboy';
import { nanoid } from 'nanoid';

export default function postVideoStream(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const bb = busboy({ headers: req.headers });

	bb.on('file', (_, file, info) => {
		const videoID = nanoid();

		//const videoPath = `./videos/${videoID}/video.mp4`;
		const videoPath = `./videos/${videoID}.mp4`;

		const stream = fs.createWriteStream(videoPath);

		file.pipe(stream);
	});

	bb.on('close', () => {
		res.writeHead(200, { Connection: 'close' });
		res.end('');
	});

	req.pipe(bb);
}
