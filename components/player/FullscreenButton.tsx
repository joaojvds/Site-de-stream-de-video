import React, { useEffect, useState } from 'react';
import { FaCompress, FaExpand } from 'react-icons/fa';
import styles from '../../styles/player/PlayerContainer.module.scss';

export default function FullscreenButton(props) {
	const { containerRef } = props;
	const [fullscreen, setFullscreen] = useState(false);

	useEffect(() => {
		document.onfullscreenchange = (e) => {
			if (document.fullscreenElement) {
				setFullscreen(true);
			} else {
				setFullscreen(false);
			}
		};
	}, []);

	const fullscreenHandler = async () => {
		const containerElement = containerRef.current as HTMLDivElement & {
			mozRequestFullScreen(): Promise<void> | undefined;
			webkitRequestFullscreen(): Promise<void> | undefined;
			msRequestFullscreen(): Promise<void> | undefined;
		};
		const documentElement = document as Document & {
			mozCancelFullScreen(): Promise<void> | undefined;
			webkitExitFullscreen(): Promise<void> | undefined;
			msExitFullscreen(): Promise<void> | undefined;
		};

		containerElement.onfullscreenchange;
		try {
			if (!documentElement.fullscreenElement) {
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

	return (
		<button
			className={styles.button}
			onKeyDown={(e) => e.preventDefault()}
			onClick={() => fullscreenHandler()}
		>
			{fullscreen ? (
				<FaCompress className={styles.icon} />
			) : (
				<FaExpand className={styles.icon} />
			)}
		</button>
	);
}
