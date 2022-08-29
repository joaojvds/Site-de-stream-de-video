import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	FaPlay,
	FaPause,
	FaRedo,
	FaVolumeOff,
	FaVolumeDown,
	FaVolumeUp,
	FaVolumeMute,
	FaExpand,
	FaCompress,
	FaArrowLeft,
} from 'react-icons/fa';
import { useIdleTimer } from 'react-idle-timer';
import styles from '../../styles/player/PlayerOld.module.scss';

export default function Player() {
	const router = useRouter();

	const containerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const [play, setPlay] = useState(false);
	const [ended, setEnded] = useState(false);
	const [volume, setVolume] = useState(1);
	const [progress, setProgress] = useState(0);
	const [fullscreen, setFullscreen] = useState(false);
	const [muted, setMuted] = useState(false);
	const [currentTime, setCurrentTime] = useState('00:00');
	const [duration, setDuration] = useState('00:00');
	const [idle, setIdle] = useState(false);

	const { videoID } = router.query;

	const onIdle = () => setIdle(true);
	const onActive = () => setIdle(false);

	const idleTimer = useIdleTimer({
		timeout: 3000,
		onIdle: onIdle,
		onActive: onActive,
	});

	//let timeout; //= setTimeout(() => setIdle(true), 3000);

	useEffect(() => {
		console.log(idle);
	}, [idle]);

	useEffect(() => {
		videoRef.current.volume = volume;
	}, [volume]);

	const videoHandler = () => {
		if (!videoRef.current.duration) return;
		if (videoRef.current.paused || videoRef.current.ended) {
			videoRef.current.play();
		} else {
			videoRef.current.pause();
		}
	};

	const progressHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!videoRef.current.duration) return;
		setEnded(false);
		videoRef.current.currentTime = videoRef.current.duration * +e.target.value;
		setCurrentTime(formatTime(videoRef.current.currentTime));
		setProgress(+e.target.value);
	};

	const volumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!videoRef.current.duration) return;
		videoRef.current.muted = false;
		setMuted(false);
		videoRef.current.volume = +e.target.value;
		setVolume(+e.target.value);
	};

	const muteHandler = () => {
		if (!videoRef.current.duration) return;
		videoRef.current.muted = !videoRef.current.muted;
		setMuted(videoRef.current.muted);
	};

	const fullscreenHandler = async () => {
		const containerElement = containerRef.current as HTMLDivElement & {
			mozRequestFullScreen(): Promise<void>;
			webkitRequestFullscreen(): Promise<void>;
			msRequestFullscreen(): Promise<void>;
		};
		const documentElement = document as Document & {
			mozCancelFullScreen(): Promise<void>;
			webkitExitFullscreen(): Promise<void>;
			msExitFullscreen(): Promise<void>;
		};

		try {
			if (!documentElement.fullscreenElement) {
				setFullscreen(true);
				if (containerElement.requestFullscreen) {
					containerRef.current.requestFullscreen();
				} else if (containerElement.webkitRequestFullscreen) {
					containerElement.webkitRequestFullscreen(); /* Chrome, Safari and Opera */
				} else if (containerElement.mozRequestFullScreen) {
					containerElement.mozRequestFullScreen(); /* Firefox */
				} else if (containerElement.msRequestFullscreen) {
					containerElement.msRequestFullscreen(); /* IE/Edge */
				}
				await screen.orientation.lock('landscape');
			} else {
				setFullscreen(false);
				if (documentElement.exitFullscreen) {
					document.exitFullscreen();
				} else if (documentElement.webkitExitFullscreen) {
					documentElement.webkitExitFullscreen(); /* Chrome, Safari and Opera */
				} else if (documentElement.mozCancelFullScreen) {
					documentElement.mozCancelFullScreen(); /* Firefox */
				} else if (documentElement.msExitFullscreen) {
					documentElement.msExitFullscreen(); /* IE/Edge */
				}
				await screen.orientation.unlock();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const formatTime = (time: number) => {
		if (!time || time == 0) return '00:00';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time - minutes * 60);

		return `${minutes.toLocaleString('EN-US', {
			minimumIntegerDigits: 2,
		})}:${seconds.toLocaleString('EN-US', { minimumIntegerDigits: 2 })}`;
	};

	const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
		const videoTarget = e.target as HTMLVideoElement;
		if (!videoTarget.currentTime || !videoTarget.duration) return;
		setProgress(
			(videoTarget.currentTime || 0 * 100) / videoTarget.duration || 0
		);
		setCurrentTime(formatTime(videoTarget.currentTime));
	};

	const onDurationChange = (
		e: React.SyntheticEvent<HTMLVideoElement, Event>
	) => {
		const videoTarget = e.target as HTMLVideoElement;
		if (!videoTarget.duration) return;
		setDuration(formatTime(videoTarget.duration));
	};

	return (
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
				<span className={styles.title}>Titulo</span>
			</div>
			<video
				ref={videoRef}
				src={`./api/${videoID}/video`}
				className={styles.player}
				onTimeUpdate={onTimeUpdate}
				onDurationChange={onDurationChange}
				onPlay={() => {
					setPlay(true);
					setEnded(false);
				}}
				onPause={() => {
					setPlay(false);
					setEnded(false);
				}}
				onEnded={() => {
					setEnded(true);
				}}
				onClick={() => videoHandler()}
				autoPlay
			/>
			<div className={styles.videoControlsContainer}>
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
						onChange={(e) => progressHandle(e)}
					/>
					<span className={styles.text}>{duration}</span>
				</div>
				<div className={styles.controls}>
					<div>
						<button className={styles.button} onClick={() => videoHandler()}>
							{ended ? (
								<FaRedo className={styles.icon} />
							) : play ? (
								<FaPause className={styles.icon} />
							) : (
								<FaPlay className={styles.icon} />
							)}
						</button>
						<div className={styles.volumeContainer}>
							<button className={styles.button} onClick={() => muteHandler()}>
								{muted ? (
									<FaVolumeMute className={styles.icon} />
								) : volume == 0 ? (
									<FaVolumeOff className={styles.icon} />
								) : volume < 0.75 ? (
									<FaVolumeDown className={styles.icon} />
								) : (
									<FaVolumeUp className={styles.icon} />
								)}
							</button>
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
								onChange={(e) => volumeHandler(e)}
							/>
						</div>
					</div>
					<button className={styles.button} onClick={() => fullscreenHandler()}>
						{fullscreen ? (
							<FaCompress className={styles.icon} />
						) : (
							<FaExpand className={styles.icon} />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
