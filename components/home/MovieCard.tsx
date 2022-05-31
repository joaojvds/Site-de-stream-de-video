import React from 'react';
import Image from 'next/image';
import styles from '../../styles/home/MovieCard.module.scss';

export default function MovieCard() {
	return (
		<div className={styles.itemContainer}>
			<div className={styles.imgContainer}>
				<Image
					className={styles.imgCover}
					src="/images/danganronpa-cover.jpg"
					layout="fill"
					objectFit="cover"
				/>
			</div>
			<span className={styles.itemTitle}>Danganronpa</span>
		</div>
	);
}
