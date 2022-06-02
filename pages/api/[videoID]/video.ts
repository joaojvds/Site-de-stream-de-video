import type { NextApiRequest, NextApiResponse } from 'next';
import sendVideo from './_sendVideo';

export const config = {
	api: {
		externalResolver: true,
	},
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	/** Id do video, informado pelo client. */
	const videoID = req.query.videoID as string;

	/** Caminho do video. */
	const videoPath = `./videos/${videoID}/video.mp4`;

	/** Checa o método http do request e direciona para a função certa. */
	switch (req.method) {
		case 'GET':
			return sendVideo(videoPath, req, res);
		default:
			res.setHeader('allow', ['GET']);
			return res.status(405).end(`Method ${req.method} not allowed`);
	}
}
