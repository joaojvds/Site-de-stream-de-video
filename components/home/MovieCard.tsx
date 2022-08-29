import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/home/MovieCard.module.scss';
import {
	SelectedItemContext,
	SetItemContext,
} from '../../contexts/SelectedItems';
import { getPlaiceholder } from 'plaiceholder';
import { getItemInfo } from '../../services/axios';

type Props = {
	videoID: string;
};

type Info = {
	id: string;
	title: string;
	description: string;
	rating: string;
	duration: string;
	releaseDate: string;
	videoType: string;
};

/* export async function getStaticProps({ videoID }) {
	const { base64, img } = await getPlaiceholder(`/api/${videoID}/cover`);

	return {
		props: {
			imageProps: {
				...img,
				blurDataURL: base64,
			},
		},
	};
} */

export default function MovieCard(props: Props) {
	const selectedItem = useContext(SelectedItemContext);
	const setItem = useContext(SetItemContext);
	const { videoID } = props;

	const [imageSrc, setImageSrc] = useState(`/api/${videoID}/cover`);
	const [info, setInfo] = useState<Info>();

	useEffect(() => {
		getItemInfo(videoID, setInfo);
	}, []);

	useEffect(() => {}, [selectedItem]);

	return (
		<button onClick={() => setItem(videoID)} className={styles.itemContainer}>
			<div className={styles.imgContainer}>
				<Image
					className={`${styles.imgCover} ${
						selectedItem == videoID ? styles.selectedItem : ''
					}`}
					src={imageSrc}
					placeholder="empty"
					//blurDataURL={placeholder}
					layout="fill"
					objectFit="cover"
					onError={() => setImageSrc('/images/cover.webp')}
				/>
			</div>
			<span className={styles.itemTitle}>{info?.title || ''}</span>
		</button>
	);
}
