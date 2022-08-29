import React, { useContext, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { SendOverlayContext } from '../../contexts/SelectedItems';
import styles from '../../styles/home/AddCard.module.scss';

export default function AddCard() {
	const setSendOverlay = useContext(SendOverlayContext)[1];

	return (
		<button
			onClick={() => setSendOverlay(true)}
			className={styles.itemContainer}
		>
			<div className={styles.imgContainer}>
				<FaPlus className={styles.icon} />
				<span className={styles.iconLabel}>Add Movie</span>
			</div>
		</button>
	);
}
