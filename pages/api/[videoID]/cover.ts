import type { NextApiRequest, NextApiResponse } from 'next';
import sendImage from './_sendImage';

export const config = {
	api: {
		externalResolver: true,
	},
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	/** Id do video, informado pelo client. */
	const videoID = req.query.videoID as string;

	/** Caminho da imagem. */
	const imagePath = `./videos/${videoID}/cover.webp`;

	/** Checa o método http do request e direciona para a função certa. */
	switch (req.method) {
		case 'GET':
			return sendImage(imagePath, res);
		default:
			res.setHeader('allow', ['GET']);
			return res.status(405).end(`Method ${req.method} not allowed`);
	}
}
