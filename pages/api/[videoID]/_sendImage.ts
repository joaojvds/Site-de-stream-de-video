import type { NextApiResponse } from 'next';
import fs from 'fs';

/**
 * Cria uma stream de um arquivo de imagem.
 * @param {string} imagePath - Caminho onde o imagem está localizado.
 * @param {NextApiResponse} res - Next API route response.
 */
export default function sendImage(imagePath: string, res: NextApiResponse) {
	/** Abre o arquivo e pega as informações dele. */
	fs.stat(imagePath, (error, stat) => {
		/** Checa se o caminho é valido. */
		if (error) {
			if (error.code == 'ENOENT') return res.status(404).end('not found');
			return res.status(500).end('internal server error');
		}

		/** O header da imagem. */
		const headers = {
			'Content-Length': stat.size,
			'Content-Type': 'image/webp',
		};

		/** Manda o status code do request e escreve o header da imagem. */
		res.writeHead(200, headers);

		/** Cria uma stream da imagem. */
		const imageStream = fs.createReadStream(imagePath);

		/** Direciona a stream da imagem para o response do request. */
		imageStream.pipe(res);
	});
}
