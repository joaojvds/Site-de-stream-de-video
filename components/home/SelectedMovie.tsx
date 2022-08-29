import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';

import styles from '../../styles/home/SelectedMovie.module.scss';
import Image from 'next/image';
import { getItemInfo } from '../../services/axios';
import { SelectedItemContext } from '../../contexts/SelectedItems';

type Info = {
	id: string;
	title: string;
	description: string;
	rating: string;
	duration: string;
	releaseDate: string;
	videoType: string;
};

function SelectedMovie() {
	const selectedItem = useContext(SelectedItemContext);

	const [imageSrc, setImageSrc] = useState(`/api/${selectedItem}/thumbnail`);
	const [info, setInfo] = useState<Info>();

	useEffect(() => {
		setImageSrc(`/api/${selectedItem}/thumbnail`);
		if (selectedItem) getItemInfo(selectedItem, setInfo);
	}, [selectedItem]);

	return (
		<div className={styles.container}>
			<Image
				className={styles.imgBackground}
				src={imageSrc}
				layout="fill"
				objectFit="cover"
				onError={() => setImageSrc('/images/thumbnail.webp')}
			/>
			<div className={styles.textInfo}>
				<span className={styles.title}>{info?.title || ''}</span>
				<div className={styles.movieData}>
					<span className={styles.rating}>{info?.rating || '--'}</span>
					<span className={styles.data}>{info?.releaseDate || ''}</span>
					<span className={styles.data}>{info?.duration || ''}</span>
					<span className={styles.data}>{info?.videoType || ''}</span>
				</div>
				{info?.description ? (
					<span className={styles.description}>{info.description}</span>
				) : (
					<div className={styles.loadingContainer}>
						<span className={styles.loadingText} />
						<span className={styles.loadingText} />
						<span className={styles.loadingText} />
						<span className={styles.loadingText} />
					</div>
				)}
				<div className={styles.buttonContainer}>
					<Link href={`/${selectedItem}`}>
						<button className={styles.watchButton}>Assistir</button>
					</Link>
					<button className={styles.listButton}>+ Minha lista</button>
				</div>
			</div>
		</div>
	);
}

export default SelectedMovie;
