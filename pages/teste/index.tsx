import React from 'react';
import Link from 'next/link';
import Image from 'next/dist/client/image';
import Head from 'next/head';

export default function index() {
	return (
		<>
			<Head>
				<title>teste</title>
			</Head>
			<Link href="/">
				<a>Home</a>
			</Link>
			<Image alt="teste" src={'/images/profile.jpg'} height={144} width={144} />
		</>
	);
}
