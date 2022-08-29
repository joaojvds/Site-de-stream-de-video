import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useIdleTimer } from 'react-idle-timer';
import { getItemInfo } from '../../services/axios';

import styles from '../../styles/player/PlayerContainer.module.scss';

import PlayerContext from '../../contexts/PlayerContext';
import Player from '../../components/player/Player';
import DurationBar from '../../components/player/DurationBar';
import PlayButton from '../../components/player/PlayButton';
import VolumeBar from '../../components/player/VolumeBar';
import FullscreenButton from '../../components/player/FullscreenButton';

type Info = {
	id: string;
	title: string;
	description: string;
	rating: string;
	duration: string;
	releaseDate: string;
	videoType: string;
};

export default function PlayerContainer() {
	const router = useRouter();

	const containerRef = useRef<HTMLDivElement>(null);

	const [idle, setIdle] = useState(false);

	//const videoID = '45uKRW50N4cRRP93QXwku';

	const [info, setInfo] = useState<Info | null>();

	const { videoID } = router.query;

	useEffect(() => {
		if (!router.isReady) return;
		if (!Array.isArray(videoID)) getItemInfo(videoID, setInfo);
	}, [router]);

	const idleTimer = useIdleTimer({
		timeout: 3000,
		onIdle: () => setIdle(true),
		onActive: () => setIdle(false),
	});

	return (
		<PlayerContext>
			<div
				ref={containerRef}
				className={`${idle ? styles.disabled : styles.playerContainer}`}

				//className={styles.playerContainer}
			>
				<div className={styles.navigationControlsContainer}>
					<Link href="/">
						<button className={styles.button}>
							<FaArrowLeft className={styles.icon} />
							<span>Voltar</span>
						</button>
					</Link>
				</div>
				<Player videoID={videoID} />
				<div className={styles.videoControlsContainer}>
					<DurationBar />
					<div className={styles.controls}>
						<div className={styles.controlsLeft}>
							<PlayButton />
							<VolumeBar />
						</div>
						<div className={styles.controlsCenter}>
							<span className={styles.title}>{info?.title || ''}</span>
						</div>
						<div className={styles.controlsRight}>
							<FullscreenButton containerRef={containerRef} />
						</div>
					</div>
				</div>
			</div>
		</PlayerContext>
	);
}
