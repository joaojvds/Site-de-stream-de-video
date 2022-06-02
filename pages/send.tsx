import React, { useState } from 'react';
import axios from 'axios';

export default function Video() {
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

	return (
		<div>
			<div>
				<span>Titulo</span>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>
			<div>
				<span>Descrição</span>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>
			<div>
				<span>Classificação</span>
				<input
					type="text"
					value={rating}
					onChange={(e) => setRating(e.target.value)}
				/>
			</div>
			<div>
				<span>Duração</span>
				<input
					type="text"
					value={duration}
					onChange={(e) => setDuration(e.target.value)}
				/>
			</div>
			<div>
				<span>Lançamento</span>
				<input
					type="text"
					value={releaseDate}
					onChange={(e) => setReleaseDate(e.target.value)}
				/>
			</div>
			<div>
				<span>tipo</span>
				<input
					type="text"
					value={videoType}
					onChange={(e) => setVideoType(e.target.value)}
				/>
			</div>
			{errorMessage && <span>{errorMessage}</span>}
			{submit && <span>{progress}%</span>}
			<div>
				<span>Capa</span>
				<input
					type="file"
					accept="image/*"
					onChange={(e) => handleFile(e, setCover)}
				/>
			</div>
			<div>
				<span>Thumbnail</span>
				<input
					type="file"
					accept="image/*"
					onChange={(e) => handleFile(e, setThumbnail)}
				/>
			</div>
			<div>
				<span>filme</span>
				<input
					type="file"
					accept=".mp4"
					onChange={(e) => handleFile(e, setVideo)}
				/>
			</div>
			<button onClick={handleSubmit}>Enviar</button>
		</div>
	);
}
