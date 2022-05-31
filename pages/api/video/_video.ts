import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

type Data = {
	movieList: string[];
};

const CHUNK_SIZE_IN_BYTE = 1000000; // 1mb

function videoStream(req: NextApiRequest, res: NextApiResponse) {
	const videoID = req.query.videoID; //'fdglir';

	const videoPath = `./videos/${videoID}/video.mp4`;

	if (!fs.existsSync(videoPath)) return res.status(404).send('file not exist');

	const videoSize = fs.statSync(videoPath).size;

	const range = req.headers.range;

	if (range) {
		const chunkStart = Number(range.replace(/\D/g, ''));

		const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTE, videoSize - 1);

		const contentLength = chunkEnd - chunkStart + 1;

		const headers = {
			'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${videoSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': contentLength,
			'Content-Type': 'video/mp4',
		};

		res.writeHead(206, headers);

		const videoStream = fs.createReadStream(videoPath, {
			start: chunkStart,
			end: chunkEnd,
		});

		videoStream.pipe(res);
	} else {
		const headers = {
			'Content-Length': videoSize,
			'Content-Type': 'video/mp4',
		};

		res.writeHead(200, headers);

		const videoStream = fs.createReadStream(videoPath);

		videoStream.pipe(res);
	}
}

function videoUpload(req: NextApiRequest, res: NextApiResponse) {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method == 'GET') {
		return videoStream(req, res);
	}

	if (req.method == 'POST') {
		return videoUpload(req, res);
	}
}
