import React, { useContext } from 'react';
import {
	CurrentTimeContext,
	DurationContext,
	EndedContext,
	ProgressContext,
	VideoRefContext,
} from '../../contexts/PlayerContext';
import styles from '../../styles/player/Duration.module.scss';

export default function DurationBar() {
	const videoRef = useContext(VideoRefContext);
	const [progress, setProgress] = useContext(ProgressContext);
	const [currentTime, setCurrentTime] = useContext(CurrentTimeContext);
	const duration = useContext(DurationContext)[0];
	const setEnded = useContext(EndedContext)[1];

	const progressHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!videoRef.current) return;
		setEnded(false);
		videoRef.current.currentTime = videoRef.current.duration * +e.target.value;
		setCurrentTime(videoRef.current.currentTime);
		setProgress(+e.target.value);
	};

	return (
		<div className={styles.durationBarContainer}>
			<span className={styles.text}>{currentTime}</span>
			<input
				className={styles.durationBar}
				type="range"
				min={0}
				max={1}
				value={progress}
				style={
					{
						'--value': progress,
						'--min': 0,
						'--max': 1,
					} as React.CSSProperties
				}
				step="any"
				tabIndex={-1}
				onChange={(e) => progressHandle(e)}
			/>
			<span className={styles.text}>{duration}</span>
		</div>
	);
}
