import React, { useContext } from 'react';
import { IoPause, IoPlay, IoReload } from 'react-icons/io5';
import {
	PlayContext,
	EndedContext,
	VideoRefContext,
	IconContext,
} from '../../contexts/PlayerContext';
import styles from '../../styles/player/PlayerContainer.module.scss';

export default function PlayButton() {
	const videoRef = useContext(VideoRefContext);
	const play = useContext(PlayContext)[0];
	const ended = useContext(EndedContext)[0];
	const setIcon = useContext(IconContext)[1];

	const videoHandler = () => {
		if (!videoRef.current) return;
		setIcon('');
		if (videoRef.current.paused || videoRef.current.ended) {
			setIcon('play');
			videoRef.current.play();
		} else {
			setIcon('pause');
			videoRef.current.pause();
		}
		setTimeout(() => setIcon(''), 200);
	};

	return (
		<button
			className={styles.button}
			onKeyDown={(e) => e.preventDefault()}
			onClick={() => videoHandler()}
		>
			{ended ? (
				<IoReload className={styles.icon} />
			) : play ? (
				<IoPause className={styles.icon} />
			) : (
				<IoPlay className={styles.icon} />
			)}
		</button>
	);
}
