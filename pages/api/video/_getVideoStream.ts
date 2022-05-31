import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

/** Tamanho total de cada chunk do video */
const CHUNK_SIZE_IN_BYTE = 2000000; // 2mb

export default function getVideoStream(
	req: NextApiRequest,
	res: NextApiResponse
) {
	/** Id do video que será enviado providenciado pelo client. */
	const videoID = req.query.videoID as string;

	/** Caminho do video. */
	const videoPath = `./videos/${videoID}/video.mp4`;

	/** Checa se o caminho é valido. */
	if (!fs.existsSync(videoPath)) return res.status(404).send('file not exist');

	/** Tamanho do video em bytes. */
	const videoSize = fs.statSync(videoPath).size;

	/** Intervalo do chunk requisitado pelo navegador. */
	const range = req.headers.range;

	/** Checa se o navegador providenciou o range. */
	if (range) {
		/** Começo do intervalo onde o vídeo irá começar. */
		const chunkStart = Number(range.replace(/\D/g, ''));

		/**
		 * Final do intervalo onde o vídeo irá terminar, se o final for menor
		 * que o tamanho do chunk o tamanho do vídeo será usado no lugar.
		 */
		const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTE, videoSize - 1);

		/** Tamanho do chunk em bytes */
		const contentLength = chunkEnd - chunkStart + 1;

		/** Header do vídeo */
		const headers = {
			'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${videoSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': contentLength,
			'Content-Type': 'video/mp4',
		};

		/** Escreve no header do request que ele será um Partial Content(206) e as informações do header video */
		res.writeHead(206, headers);

		/** Cria uma stream do vídeo enviando o intervalo especificado */
		const videoStream = fs.createReadStream(videoPath, {
			start: chunkStart,
			end: chunkEnd,
		});

		/** Direciona a stream do video para o response do request */
		videoStream.pipe(res);
	} else {
		/** Header do vídeo sem as informações do chunk */
		const headers = {
			'Content-Length': videoSize,
			'Content-Type': 'video/mp4',
		};

		/** Escreve no header do request que ele será um request completo(200) e as informações do header video */
		res.writeHead(200, headers);

		/** Cria uma stream do vídeo enviando o vídeo completo */
		const videoStream = fs.createReadStream(videoPath);

		/** Direciona a stream do video para o response do request */
		videoStream.pipe(res);
	}
}
