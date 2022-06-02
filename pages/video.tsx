import React from 'react';

export default function Video() {
	const id = '2Ak6vLxzHEySQH7HQiGuT';

	return (
		<video
			src={`./api/${id}/video`}
			width="800px"
			height="auto"
			controls
			autoPlay
		/>
	);
}
