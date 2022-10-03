import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import fs from 'fs';
import busboy from 'busboy';
import sharp from 'sharp';
import PQueue from 'p-queue';
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

	new Promise<void>((resolve, reject: (statusCode?: number) => void) => {
		/** Cria um diretório com o ID do vídeo. */
		fs.mkdir(folderPath, (error) => {
			/** Retorna um erro se houver algum problema na criação do diretório. */
			if (error) return reject(500);

			/** Instância do busboy. */
			const bb = busboy({ headers: req.headers });

			const workQueue = new PQueue({ concurrency: 1 });

			function abort() {
				req.unpipe(bb);
				workQueue.pause();
				reject(400);
			}

			async function handleError(fn: () => void) {
				workQueue.add(async () => {
					try {
						fn();
					} catch (e) {
						abort();
					}
				});
			}

			/** Esculta por campos de texto no request. */
			bb.on('field', (name, val, info) => {
				/** Salva os campos do request no objeto metadata. */
				metadata[name] = val;
			});

			/** Esculta por arquivos no request. */
			bb.on('file', (name, file, info) => {
				handleError(() => {
					/** Checa se as chaves do request estão certas. */
					if (name !== 'cover' && name !== 'thumbnail' && name !== 'video')
						throw new Error('Bad Request');

					if (name == 'video') {
						/** Checa se o arquivo é um mp4. */
						if (info.mimeType !== 'video/mp4') {
							throw new Error('Bad Request');
						}

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
							throw new Error('Bad Request');

						/** Caminho onde a imagem será salvo. */
						const imagePath = `${folderPath}/${name}.webp`;

						/** Converte o arquivo de imagem para webp e salva a imagem no caminho providenciado.  */
						const convert = sharp()
							.webp()
							.toFile(imagePath, (err, info) => {
								if (err) {
									return abort();
								}
							});

						/** Direciona o stream do arquivo para o conversor. */
						file.pipe(convert);
					}
				});
			});

			/** Executa quando não houver campos para processar. */
			bb.on('close', () => {
				handleError(() => {
					/** Salva o objeto metadata em um arquivo json. */
					fs.writeFileSync(
						`${folderPath}/metadata.json`,
						JSON.stringify(metadata)
					);
					/** Resolve a promise */
					resolve();
				});
			});

			/** Direciona o request para a instância do busboy. */
			req.pipe(bb);
		});
	})
		.then(() => {
			/** Manda um código http 200 e fecha a conexão. */
			res.writeHead(200, { Connection: 'close' });
			res.end('');
		})
		.catch((e: number) => {
			//fs.rmSync(folderPath, { recursive: true, force: true });
			if (!res.destroyed) {
				switch (e) {
					case 400:
						res.writeHead(400, { Connection: 'close' });
						res.end('bad request');
						break;
					default:
						res.writeHead(500, { Connection: 'close' });
						res.end('internal server error');
						break;
				}
			}
		});
}
