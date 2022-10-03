import React, { useEffect, createContext, useState } from 'react';
import { getItemsList } from '../services/axios';

export const ItemListContext = createContext<string[] | null>(null);
export const UpdateItemListContext = createContext<() => void | null>(null);
export const SelectedItemContext = createContext<string | null>(null);
export const SetItemContext =
	createContext<(videoID: string) => void | null>(null);
export const SendOverlayContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>>] | null
>(null);

export default function SelectedItem({ children }) {
	const [itemList, setItemList] = useState<string[]>([]);
	const [selectedItem, setSelectedItem] = useState<string>();
	const [sendOverlay, setSendOverlay] = useState(false);

	useEffect(() => {
		getItemsList(setItemList);
	}, []);

	useEffect(() => {
		if (itemList.length > 0) setSelectedItem(itemList[0]);
	}, [itemList]);

	const setItem = (videoID: string) => {
		setSelectedItem(videoID);
	};

	const updateList = () => {
		getItemsList(setItemList);
	};

	return (
		<ItemListContext.Provider value={itemList}>
			<UpdateItemListContext.Provider value={updateList}>
				<SelectedItemContext.Provider value={selectedItem}>
					<SetItemContext.Provider value={setItem}>
						<SendOverlayContext.Provider value={[sendOverlay, setSendOverlay]}>
							{children}
						</SendOverlayContext.Provider>
					</SetItemContext.Provider>
				</SelectedItemContext.Provider>
			</UpdateItemListContext.Provider>
		</ItemListContext.Provider>
	);
}
