import React, {
	useEffect,
	createContext,
	useState,
	Children,
	useRef,
} from 'react';

export const VideoRefContext =
	createContext<React.MutableRefObject<HTMLVideoElement> | null>(null);
export const PlayContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>>] | null
>(null);
export const EndedContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>>] | null
>(null);
export const ProgressContext = createContext<
	[number, React.Dispatch<React.SetStateAction<number>>] | null
>(null);
export const CurrentTimeContext = createContext<
	[string, (currentTime: number) => void] | null
>(null);
export const DurationContext = createContext<
	[string, (duration: number) => void] | null
>(null);
export const VolumeContext = createContext<
	[number, React.Dispatch<React.SetStateAction<number>>] | null
>(null);
export const MutedContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>>] | null
>(null);
export const IconContext = createContext<
	[string, React.Dispatch<React.SetStateAction<string>>] | null
>(null);

export default function PlayerContext({ children }) {
	const videoRef = useRef<HTMLVideoElement>(null);

	const [play, setPlay] = useState(false);
	const [ended, setEnded] = useState(false);
	const [progress, setProgress] = useState(0);
	const [currentTime, _setCurrentTime] = useState('00:00');
	const [duration, _setDuration] = useState('00:00');
	const [volume, setVolume] = useState(1);
	const [muted, setMuted] = useState(false);
	const [Icon, setIcon] = useState('');

	const formatTime = (time: number) => {
		if (!time || time == 0) return '00:00';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time - minutes * 60);

		return `${minutes.toLocaleString('EN-US', {
			minimumIntegerDigits: 2,
		})}:${seconds.toLocaleString('EN-US', { minimumIntegerDigits: 2 })}`;
	};

	const setCurrentTime = (currentTime: number) => {
		_setCurrentTime(formatTime(currentTime));
	};

	const setDuration = (duration: number) => {
		_setDuration(formatTime(duration));
	};

	return (
		<VideoRefContext.Provider value={videoRef}>
			<PlayContext.Provider value={[play, setPlay]}>
				<EndedContext.Provider value={[ended, setEnded]}>
					<ProgressContext.Provider value={[progress, setProgress]}>
						<CurrentTimeContext.Provider value={[currentTime, setCurrentTime]}>
							<DurationContext.Provider value={[duration, setDuration]}>
								<VolumeContext.Provider value={[volume, setVolume]}>
									<MutedContext.Provider value={[muted, setMuted]}>
										<IconContext.Provider value={[Icon, setIcon]}>
											{children}
										</IconContext.Provider>
									</MutedContext.Provider>
								</VolumeContext.Provider>
							</DurationContext.Provider>
						</CurrentTimeContext.Provider>
					</ProgressContext.Provider>
				</EndedContext.Provider>
			</PlayContext.Provider>
		</VideoRefContext.Provider>
	);
}
