import React, { useState } from 'react';

export default function Video() {
	const [file, setFile] = useState<File | undefined>();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [rating, setRating] = useState('');
	const [releaseDate, setReleaseDate] = useState('');
	const [videoType, setVideoType] = useState('');

	const handleFile = () => {};

	return (
		<div>
			<div>
				<span>Titulo</span>
				<input type="text" />
			</div>
			<input type="file" accept=".mp4" onChange={handleFile} />
		</div>
	);
}
