import React, { useContext, useEffect, useState } from 'react';
import styles from '../../styles/home/MovieList.module.scss';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ItemListContext } from '../../contexts/SelectedItems';

import MovieCard from './MovieCard';
import AddCard from './AddCard';

function MovieList() {
	const itemList = useContext(ItemListContext);

	return (
		<div className={styles.container}>
			<span className={styles.listTitle}>Novidades</span>
			<ScrollMenu
				LeftArrow={ArrowLeft}
				RightArrow={ArrowRight}
				scrollContainerClassName={styles.itemList}
			>
				{itemList.map((item) => (
					<MovieCard key={item} videoID={item} />
				))}
				<AddCard />
			</ScrollMenu>
		</div>
	);
}

function ArrowLeft() {
	const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
	const [disable, setDisable] = useState(isFirstItemVisible);

	useEffect(() => {
		setDisable(isFirstItemVisible);
	}, [isFirstItemVisible]);

	return (
		<button
			disabled={disable}
			className={styles.arrowButton}
			onClick={() => scrollPrev()}
		>
			<FaChevronLeft className={styles.icon} />
		</button>
	);
}

function ArrowRight() {
	const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

	const [disable, setDisable] = useState(isLastItemVisible);

	useEffect(() => {
		setDisable(isLastItemVisible);
	}, [isLastItemVisible]);

	return (
		<button
			disabled={disable}
			className={styles.arrowButton}
			onClick={() => scrollNext()}
		>
			<FaChevronRight className={styles.icon} />
		</button>
	);
}

export default MovieList;
