import React from 'react';
import styles from '../../styles/home/SelectedMovie.module.scss';
import Image from 'next/image';
import MoviePicture from '../../public/images/bosco.jpg';

function SelectedMovie() {
	return (
		<div className={styles.container}>
			<Image
				className={styles.imgBackground}
				src={'/images/bosco.jpg'}
				height="100%"
				width="100%"
				layout="fill"
				objectFit="cover"
			/>
			<div className={styles.textInfo}>
				<span className={styles.title}>Dom Bosco</span>
				<div className={styles.movieData}>
					<span className={styles.rating}>L</span>
					<span className={styles.data}>1941</span>
					<span className={styles.data}>1:39min</span>
					<span className={styles.data}>Filme</span>
				</div>
				<span className={styles.description}>
					A história de São João Bosco, fundador da Congregação dos Salesianos,
					que dedicou a vida a acolher e educar os jovens.
				</span>
				<div className={styles.buttonContainer}>
					<button className={styles.watchButton}>Assistir</button>
					<button className={styles.listButton}>+ Minha lista</button>
				</div>
			</div>
		</div>
	);
}

export default SelectedMovie;
