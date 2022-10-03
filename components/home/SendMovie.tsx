import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import {
	SendOverlayContext,
	UpdateItemListContext,
} from '../../contexts/SelectedItems';

import styles from '../../styles/home/SendMovie.module.scss';

import { BsFillImageFill, BsUpload } from 'react-icons/bs';
import { ImFilm } from 'react-icons/im';

type Data = {
	file: File;
	blob: string;
};

export default function SendMovie() {
	const [sendOverlay, setSendOverlay] = useContext(SendOverlayContext);
	const updateItemList = useContext(UpdateItemListContext);

	const [submit, setSubmit] = useState(false);
	const [progress, setProgress] = useState(0);
	const [message, setMessage] = useState('teste');
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [rating, setRating] = useState('');
	const [duration, setDuration] = useState('');
	const [releaseDate, setReleaseDate] = useState('');
	const [videoType, setVideoType] = useState('');
	const [video, setVideo] = useState<Data | null>(null);
	const [cover, setCover] = useState<Data | null>(null);
	const [thumbnail, setThumbnail] = useState<Data | null>(null);

	const handleFile = (
		event: React.ChangeEvent<HTMLInputElement>,
		prevFile: Data,
		setFile: React.Dispatch<Data>
	) => {
		const files = event.target.files;
		if (prevFile?.blob) URL.revokeObjectURL(prevFile.blob);

		if (files?.length) {
			setFile({ file: files[0], blob: URL.createObjectURL(files[0]) });
		} else {
			setFile(null);
		}
	};

	useEffect(() => {
		return () => {
			if (cover?.blob) URL.revokeObjectURL(cover.blob);
			if (thumbnail?.blob) URL.revokeObjectURL(thumbnail.blob);
			if (video?.blob) URL.revokeObjectURL(video.blob);
		};
	}, []);

	const cleanStates = () => {
		if (cover?.blob) URL.revokeObjectURL(cover.blob);
		if (thumbnail?.blob) URL.revokeObjectURL(thumbnail.blob);
		if (video?.blob) URL.revokeObjectURL(video.blob);
		setVideo(null);
		setCover(null);
		setThumbnail(null);
		setTitle('');
		setDescription('');
		setRating('');
		setDuration('');
		setReleaseDate('');
		setVideoType('');
	};

	const handleSubmit = async () => {
		const data = new FormData();

		setMessage('');
		setSuccess(false);
		setError(false);
		if (!video) return;

		data.append('title', title);
		data.append('description', description);
		data.append('rating', rating);
		data.append('duration', duration);
		data.append('releaseDate', releaseDate);
		data.append('videoType', videoType);
		data.append('cover', cover?.file);
		data.append('thumbnail', thumbnail?.file);
		data.append('video', video.file);

		setSubmit(true);

		try {
			const res = await axios.post('/api', data, {
				onUploadProgress: (progressEvent) => {
					setProgress(
						Math.round((progressEvent.loaded * 100) / progressEvent.total)
					);
				},
				validateStatus: function (status) {
					return status < 399;
				},
			});

			console.log(res);
			if (res.status === 200) {
				setSuccess(true);
				setMessage('Concluído');
			}
			//cleanStates();
		} catch (error) {
			setError(true);
			setMessage('Falha no upload');
			console.log(error.message);
		} finally {
			setSubmit(false);
			setProgress(0);
			updateItemList();
		}
	};

	if (sendOverlay) {
		return (
			<>
				<div className={styles.containerWindow}>
					<div className={styles.headerContainer}>
						<span className={styles.text}>Enviar Filme</span>
					</div>
					<div className={styles.mainContainer}>
						<div className={styles.imgContainer}>
							<label htmlFor="thumbnail" className={styles.thumbContainer}>
								<BsFillImageFill className={styles.imgIcon} />
								<span className={styles.fileText}>Thumbnail</span>
								<input
									id="thumbnail"
									type="file"
									accept="image/*"
									onChange={(e) => handleFile(e, thumbnail, setThumbnail)}
								/>
								{thumbnail?.blob ? (
									<Image
										className={styles.imgCover}
										src={thumbnail.blob}
										placeholder="empty"
										layout="fill"
										objectFit="cover"
									/>
								) : null}
							</label>
							<label htmlFor="cover" className={styles.coverContainer}>
								<BsFillImageFill className={styles.imgIcon} />
								<span className={styles.fileText}>Capa</span>
								<input
									id="cover"
									type="file"
									accept="image/*"
									onChange={(e) => handleFile(e, cover, setCover)}
								/>
								{cover?.blob ? (
									<Image
										className={styles.imgCover}
										src={cover.blob}
										placeholder="empty"
										layout="fill"
										objectFit="cover"
									/>
								) : null}
							</label>
						</div>
						<div className={styles.formContainer}>
							<div className={styles.inputContainer}>
								<span className={styles.text}>Titulo</span>
								<input
									className={styles.textInput}
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className={styles.detailsContainer}>
								<div className={styles.inputContainer}>
									<span className={styles.text}>Classificação</span>
									<input
										className={styles.textInput}
										type="text"
										value={rating}
										onChange={(e) => setRating(e.target.value)}
									/>
								</div>
								<div className={styles.inputContainer}>
									<span className={styles.text}>Duração</span>
									<input
										className={styles.textInput}
										type="text"
										value={duration}
										onChange={(e) => setDuration(e.target.value)}
									/>
								</div>
								<div className={styles.inputContainer}>
									<span className={styles.text}>Lançamento</span>
									<input
										className={styles.textInput}
										type="text"
										value={releaseDate}
										onChange={(e) => setReleaseDate(e.target.value)}
									/>
								</div>
								<div className={styles.inputContainer}>
									<span className={styles.text}>tipo</span>
									<input
										className={styles.textInput}
										type="text"
										value={videoType}
										onChange={(e) => setVideoType(e.target.value)}
									/>
								</div>
							</div>
							<div className={styles.inputContainer}>
								<span className={styles.text}>Descrição</span>
								<textarea
									className={styles.textAreaInput}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<label htmlFor="video" className={styles.videoContainer}>
								<ImFilm className={styles.imgIcon} />
								<span className={styles.fileText}>
									{video?.file ? video.file.name : 'filme'}
								</span>
								<input
									id="video"
									type="file"
									accept=".mp4"
									onChange={(e) => handleFile(e, video, setVideo)}
								/>
							</label>
						</div>
					</div>
					<span
						className={`${styles.message} ${success ? styles.success : ''} ${
							error ? styles.error : ''
						}`}
					>
						{message ? message : submit ? `${progress}%` : ''}
					</span>
					<div
						className={
							submit ? styles.progressContainer : styles.progressDisable
						}
					>
						<div
							className={styles.progress}
							style={{ width: `${progress}%` }}
						/>
					</div>
					<div className={styles.footerContainer}>
						<button className={styles.sendButton} onClick={handleSubmit}>
							<BsUpload />
							Enviar
						</button>
						<button
							className={styles.cancelButton}
							onClick={() => {
								setSendOverlay(false);
								cleanStates();
							}}
						>
							Cancelar
						</button>
					</div>
				</div>
				<div
					className={styles.overlay}
					onClick={() => {
						setSendOverlay(false);
						cleanStates();
					}}
				/>
			</>
		);
	} else {
		return null;
	}
}
