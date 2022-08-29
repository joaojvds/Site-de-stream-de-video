import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { SendOverlayContext } from '../../contexts/SelectedItems';

import styles from '../../styles/home/SendMovie.module.scss';
import { url } from 'inspector';

export default function SendMovie() {
	const [sendOverlay, setSendOverlay] = useContext(SendOverlayContext);

	const [submit, setSubmit] = useState(false);
	const [progress, setProgress] = useState(0);
	const [errorMessage, setErrorMessage] = useState(null);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [rating, setRating] = useState('');
	const [duration, setDuration] = useState('');
	const [releaseDate, setReleaseDate] = useState('');
	const [videoType, setVideoType] = useState('');
	const [video, setVideo] = useState<File | undefined>();
	const [cover, setCover] = useState<File | undefined>();
	const [thumbnail, setThumbnail] = useState<File | undefined>();

	const handleFile = (
		event: React.ChangeEvent<HTMLInputElement>,
		setFile: React.Dispatch<File>
	) => {
		const files = event.target.files;

		if (files?.length) {
			setFile(files[0]);
		}
	};

	const previewImg = (img: File) => {
		var reader = new FileReader();
		reader.onload = function () {
			return reader.result;
		};
		reader.readAsDataURL(img);
	};

	useEffect(() => {
		console.log(cover);
		if (cover) {
			console.log(URL.createObjectURL(cover));
		}
	}, [cover]);

	const handleSubmit = async () => {
		const data = new FormData();

		if (!video) return;

		data.append('title', title);
		data.append('description', description);
		data.append('rating', rating);
		data.append('duration', duration);
		data.append('releaseDate', releaseDate);
		data.append('videoType', videoType);
		data.append('cover', cover);
		data.append('thumbnail', thumbnail);
		data.append('video', video);

		setSubmit(true);

		try {
			await axios.post('/api', data, {
				onUploadProgress: (progressEvent) => {
					setProgress(
						Math.round((progressEvent.loaded * 100) / progressEvent.total)
					);
				},
			});
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setSubmit(false);
			setProgress(0);
		}
	};

	if (sendOverlay) {
		return (
			<>
				<div className={styles.containerWindow}>
					<div className={styles.headerContainer}>
						<span className={styles.text}>Title</span>
					</div>
					<div className={styles.mainContainer}>
						<div className={styles.imgContainer}>
							<div className={styles.inputContainer}>
								<span className={styles.text}>Thumbnail</span>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFile(e, setThumbnail)}
								/>
							</div>
							<div className={styles.inputContainer}>
								<span className={styles.text}>Capa</span>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFile(e, setCover)}
								/>
							</div>
							<div className={styles.imgContainer}>
								{cover ? (
									<Image
										className={styles.imgCover}
										src={URL.createObjectURL(cover)}
										//src={cover.name}
										placeholder="empty"
										//blurDataURL={placeholder}
										layout="fill"
										objectFit="cover"
										//onError={() => setImageSrc('/images/cover.webp')}
									/>
								) : null}
							</div>
						</div>
						<div className={styles.formContainer}>
							<div className={styles.inputContainer}>
								<span className={styles.text}>Titulo</span>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className={styles.detailsContainer}>
								<div className={styles.inputContainer}>
									<span className={styles.text}>Classificação</span>
									<input
										type="text"
										value={rating}
										onChange={(e) => setRating(e.target.value)}
									/>
								</div>
								<div className={styles.inputContainer}>
									<span className={styles.text}>Duração</span>
									<input
										type="text"
										value={duration}
										onChange={(e) => setDuration(e.target.value)}
									/>
								</div>
								<div className={styles.inputContainer}>
									<span className={styles.text}>Lançamento</span>
									<input
										type="text"
										value={releaseDate}
										onChange={(e) => setReleaseDate(e.target.value)}
									/>
								</div>
								<div className={styles.inputContainer}>
									<span className={styles.text}>tipo</span>
									<input
										type="text"
										value={videoType}
										onChange={(e) => setVideoType(e.target.value)}
									/>
								</div>
							</div>
							<div className={styles.inputContainer}>
								<span className={styles.text}>Descrição</span>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<div className={styles.inputContainer}>
								<span className={styles.text}>filme</span>
								<input
									type="file"
									accept=".mp4"
									onChange={(e) => handleFile(e, setVideo)}
								/>
							</div>
						</div>
					</div>
					{errorMessage && <span className={styles.text}>{errorMessage}</span>}
					{submit && <span className={styles.text}>{progress}%</span>}
					<div className={styles.footerContainer}>
						<button onClick={handleSubmit}>Enviar</button>
						<button onClick={() => setSendOverlay(false)}>Cancelar</button>
					</div>
				</div>
				<div className={styles.overlay} onClick={() => setSendOverlay(false)} />
			</>
		);
	} else {
		return null;
	}
}
