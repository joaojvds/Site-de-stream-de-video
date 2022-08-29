import React, { useContext, useEffect, useState } from 'react';
import {
	CurrentTimeContext,
	DurationContext,
	EndedContext,
	IconContext,
	MutedContext,
	PlayContext,
	ProgressContext,
	VideoRefContext,
	VolumeContext,
} from '../../contexts/PlayerContext';
import { IoPause, IoPlay } from 'react-icons/io5';
import { MdOutlineForward5, MdOutlineReplay5 } from 'react-icons/md';
import {
	ImVolumeIncrease,
	ImVolumeDecrease,
	ImVolumeMute2,
	ImVolumeHigh,
} from 'react-icons/im';
import styles from '../../styles/player/Player.module.scss';

type Props = {
	videoID: string | string[];
};

export default function Player(props: Props) {
	const videoRef = useContext(VideoRefContext);
	const setPlay = useContext(PlayContext)[1];
	const setEnded = useContext(EndedContext)[1];
	const setDuration = useContext(DurationContext)[1];
	const setProgress = useContext(ProgressContext)[1];
	const setCurrentTime = useContext(CurrentTimeContext)[1];
	const setVolume = useContext(VolumeContext)[1];
	const setMuted = useContext(MutedContext)[1];
	const [Icon, setIcon] = useContext(IconContext);

	const [loading, setLoading] = useState(false);
	const [timeIcon, setTimeIcon] = useState('');

	const { videoID } = props;

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, []);

	useEffect(() => {
		const videoTarget = videoRef.current as HTMLVideoElement;
		if (!videoTarget?.duration) return;
		setDuration(videoTarget.duration);
		videoRef.current.focus();
	}, [videoRef.current]);

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

	const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
		const videoTarget = e.target as HTMLVideoElement;
		if (!videoTarget.currentTime || !videoTarget.duration) return;
		setProgress(
			(videoTarget.currentTime || 0 * 100) / videoTarget.duration || 0
		);
		setCurrentTime(videoTarget.currentTime);
		setDuration(videoTarget.duration);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const videoTarget = videoRef.current as HTMLVideoElement;
		if (!videoTarget) return;
		if (e.key === ' ' || e.key === 'Enter') {
			videoHandler();
		}
		if (videoTarget.duration) {
			if (e.key === 'ArrowRight' || e.key === 'MediaTrackNext') {
				setTimeIcon('');
				let updatedTime = videoTarget.currentTime + 5;
				videoTarget.currentTime =
					updatedTime > videoTarget.duration
						? videoTarget.duration
						: updatedTime;
				setTimeIcon('forw');
				setProgress(
					(videoTarget.currentTime || 0 * 100) / videoTarget.duration || 0
				);
				setCurrentTime(videoTarget.currentTime);
				setTimeout(() => setTimeIcon(''), 200);
			}
			if (e.key === 'ArrowLeft' || e.key === 'MediaTrackPrevious') {
				setTimeIcon('');
				let updatedTime = videoTarget.currentTime - 5;
				videoTarget.currentTime = updatedTime < 0 ? 0 : updatedTime;
				setTimeIcon('back');
				setProgress(
					(videoTarget.currentTime || 0 * 100) / videoTarget.duration || 0
				);
				setCurrentTime(videoTarget.currentTime);
				setEnded(false);
				setTimeout(() => setTimeIcon(''), 200);
			}
		}
		if (e.key === 'ArrowUp') {
			setIcon('');
			setIcon('volUp');
			const updateVolume = videoTarget.volume + 0.05;
			videoRef.current.muted = false;
			setMuted(false);
			videoTarget.volume = updateVolume > 1 ? 1 : updateVolume;
			setVolume(updateVolume > 1 ? 1 : updateVolume);
			setTimeout(() => setIcon(''), 200);
		}
		if (e.key === 'ArrowDown') {
			setIcon('');
			setIcon('volDown');
			const updateVolume = videoTarget.volume - 0.05;
			videoRef.current.muted = false;
			setMuted(false);
			videoTarget.volume = updateVolume < 0 ? 0 : updateVolume;
			setVolume(updateVolume < 0 ? 0 : updateVolume);
			setTimeout(() => setIcon(''), 200);
		}
		if (e.key === 'm') {
			setIcon('');
			videoRef.current.muted = !videoRef.current.muted;
			setIcon(videoRef.current.muted ? 'volOff' : 'volOn');
			setMuted(videoRef.current.muted);
			setTimeout(() => setIcon(''), 200);
		}
	};

	if (videoID) {
		return (
			<>
				<video
					ref={videoRef}
					src={`/api/${videoID}/video`}
					className={styles.player}
					onProgress={() => setDuration(videoRef.current.duration)}
					onTimeUpdate={onTimeUpdate}
					onLoadStart={() => setLoading(true)}
					onCanPlay={() => setLoading(false)}
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
					autoPlay
				/>
				<div className={styles.overlay} onClick={() => videoHandler()}>
					{loading && <div className={styles.spinner} />}
					{Icon == 'play' && <IoPlay className={styles.icon} />}
					{Icon == 'pause' && <IoPause className={styles.icon} />}
					{Icon == 'volOn' && <ImVolumeHigh className={styles.icon} />}
					{Icon == 'volOff' && <ImVolumeMute2 className={styles.icon} />}
					{Icon == 'volUp' && <ImVolumeIncrease className={styles.icon} />}
					{Icon == 'volDown' && <ImVolumeDecrease className={styles.icon} />}
					{timeIcon == 'back' && <MdOutlineReplay5 className={styles.back} />}
					{timeIcon == 'forw' && (
						<MdOutlineForward5 className={styles.forward} />
					)}
				</div>
			</>
		);
	} else {
		return (
			<div className={styles.overlay}>
				<div className={styles.spinner} />
			</div>
		);
	}
}
