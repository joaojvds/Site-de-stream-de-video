import React from 'react';

export default function Video() {
	const id = 'abcedc';

	return (
		<video
			src={`./api/video?videoID=${id}`}
			width="800px"
			height="auto"
			controls
			autoPlay
		/>
	);
}
