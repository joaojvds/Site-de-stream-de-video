import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import busboy from 'busboy';
import sharp from 'sharp';
import { nanoid } from 'nanoid';

/**
 * Faz o upload de videos no diretório com as capas e o metadado.
 * @param {NextApiRequest} req - Next API route request
 * @param {NextApiResponse} res - Next API route response
 */
export default async function postVideoStream(
	req: NextApiRequest,
	res: NextApiResponse
) {
	/** ID do vídeo. */
	const videoID = nanoid();

	/** Caminho onde o vídeo será salvo. */
	const folderPath = `./videos/${videoID}`;

	/** metadata do vídeo. */
	let metadata = {
		id: videoID,
	};

	/** Cria um diretório com o ID do vídeo. */
	fs.mkdir(folderPath, (error) => {
		/** Retorna um erro se houver algum problema na criação do diretório. */
		if (error) return res.status(500).send('internal server error');

		/** Instância do busboy. */
		const bb = busboy({ headers: req.headers });

		/** Esculta por campos de texto no request. */
		bb.on('field', (name, val, info) => {
			/** Salva os campos do request no objeto metadata. */
			metadata[name] = val;
		});

		/** Esculta por arquivos no request. */
		bb.on('file', (name, file, info) => {
			/** Checa se as chaves do request estão certas. */
			if (name !== 'cover' && name !== 'thumbnail' && name !== 'video')
				return res.status(401).send('bad request');

			if (name == 'video') {
				/** Checa se o arquivo é um mp4. */
				if (info.mimeType !== 'video/mp4')
					return res.status(401).send('bad request');

				/** Caminho onde o vídeo será salvo. */
				const videoPath = `${folderPath}/video.mp4`;

				/** Salva o vídeo no caminho providenciado. */
				const stream = fs.createWriteStream(videoPath);

				/** Direciona o stream do arquivo para o fs. */
				file.pipe(stream);
			}

			if (name == 'cover' || name == 'thumbnail') {
				/** Checa se o arquivo é uma imagem. */
				if (!info.mimeType.includes('image/'))
					return res.status(401).send('bad request');

				/** Caminho onde a imagem será salvo. */
				const imagePath = `${folderPath}/${name}.webp`;

				/** Converte o arquivo de imagem para webp */
				const convert = sharp().webp();

				/** Salva a imagem no caminho providenciado. */
				const stream = fs.createWriteStream(imagePath);

				/** Direciona o stream do arquivo para o conversor e do conversor para o fs. */
				file.pipe(convert).pipe(stream);
			}
		});

		/** Executa quando não houver campos para processar. */
		bb.on('close', () => {
			/** Salva o objeto metadata em um arquivo json. */
			fs.writeFileSync(`${folderPath}/metadata.json`, JSON.stringify(metadata));

			/** Manda um código http 200 e fecha a conexão. */
			res.writeHead(200, { Connection: 'close' });
			res.end('');
		});

		/** Direciona o request para a instância do busboy. */
		req.pipe(bb);
	});
}
