import type { NextApiRequest, NextApiResponse } from 'next';
import postVideoStream from './_postVideoStream';
import fs from 'fs';

type Data = string[];

export const config = {
	api: {
		bodyParser: false,
	},
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	/** Checa o método http do request e direciona para a função certa. */
	switch (req.method) {
		case 'GET':
			/** Lista os arquivos no diretório. */
			return fs.readdir('./videos', (error, files) => {
				/** Checa se o caminho é valido. */
				if (error) {
					if (error.code == 'ENOENT') return res.status(404).end('not found');
					return res.status(500).end('internal server error');
				}
				/** Retorna uma lista em json com o nome de todos os diretórios na pasta. */
				return res.status(200).json(files);
			});
		case 'POST':
			return postVideoStream(req, res);
		default:
			res.setHeader('allow', ['GET', 'POST']);
			return res.status(405).end(`Method ${req.method} not allowed`);
	}
}
