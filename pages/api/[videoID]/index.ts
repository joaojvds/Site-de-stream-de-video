import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

type Data = {
	id: string;
	title: string;
	description: string;
	rating: string;
	duration: string;
	releaseDate: string;
	videoType: string;
};

export const config = {
	api: {
		externalResolver: true,
	},
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	/** Id do video que será enviado providenciado pelo client. */
	const videoID = req.query.videoID as string;

	/** Checa o método http do request e direciona para a função certa. */
	switch (req.method) {
		case 'GET':
			/** Ler o metadata do ID informado. */
			return fs.readFile(
				`./videos/${videoID}/metadata.json`,
				'utf8',
				(error, data) => {
					/** Checa se o caminho é valido. */
					if (error) {
						if (error?.code == 'ENOENT')
							return res.status(404).end('not found');
						return res.status(500).end('internal server error');
					}
					if (data) {
						/** Retorna um json com o metadata do ID informado. */
						return res.status(200).json(JSON.parse(data));
					}
				}
			);
		default:
			res.setHeader('allow', ['GET']);
			return res.status(405).end(`Method ${req.method} not allowed`);
	}
}
