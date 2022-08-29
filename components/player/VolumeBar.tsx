import React, { useContext, useEffect } from 'react';
import {
	ImVolumeHigh,
	ImVolumeMedium,
	ImVolumeLow,
	ImVolumeMute,
	ImVolumeMute2,
} from 'react-icons/im';
import {
	IconContext,
	MutedContext,
	VideoRefContext,
	VolumeContext,
} from '../../contexts/PlayerContext';
import styles from '../../styles/player/Volume.module.scss';

export default function VolumeBar() {
	const videoRef = useContext(VideoRefContext);
	const [volume, setVolume] = useContext(VolumeContext);
	const [muted, setMuted] = useContext(MutedContext);
	const setIcon = useContext(IconContext)[1];

	useEffect(() => {
		if (!videoRef.current) return;
		videoRef.current.volume = volume;
	}, [volume]);

	const volumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!videoRef.current) return;
		videoRef.current.muted = false;
		setMuted(false);
		videoRef.current.volume = +e.target.value;
		setVolume(+e.target.value);
	};

	const muteHandler = () => {
		if (!videoRef.current) return;
		setIcon('');
		videoRef.current.muted = !videoRef.current.muted;
		setIcon(videoRef.current.muted ? 'volOff' : 'volOn');
		setMuted(videoRef.current.muted);
		setTimeout(() => setIcon(''), 200);
	};

	return (
		<div className={styles.volumeContainer}>
			<button
				className={styles.button}
				onKeyDown={(e) => e.preventDefault()}
				onClick={() => muteHandler()}
			>
				{muted ? (
					<ImVolumeMute2 className={styles.icon} />
				) : volume == 0 ? (
					<ImVolumeMute className={styles.icon} />
				) : volume < 0.25 ? (
					<ImVolumeLow className={styles.icon} />
				) : volume < 0.75 ? (
					<ImVolumeMedium className={styles.icon} />
				) : (
					<ImVolumeHigh className={styles.icon} />
				)}
			</button>
			<div>
				<input
					className={styles.volumeBar}
					type="range"
					min={0}
					max={1}
					value={muted ? 0 : volume}
					step="any"
					style={
						{
							'--value': muted ? 0 : volume,
							'--min': 0,
							'--max': 1,
						} as React.CSSProperties
					}
					onKeyDown={(e) => e.preventDefault()}
					onChange={(e) => volumeHandler(e)}
				/>
			</div>
		</div>
	);
}
