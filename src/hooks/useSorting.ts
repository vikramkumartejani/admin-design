import { useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface UseSortingReturn {
    currentSortKey: string;
    currentDirection: SortDirection;
    handleSort: (key: string) => void;
}

export const useSorting = (): UseSortingReturn => {
    const [currentSortKey, setCurrentSortKey] = useState<string>('');
    const [currentDirection, setCurrentDirection] = useState<SortDirection>('asc');

    const handleSort = (key: string) => {
        if (currentSortKey === key) {
            setCurrentDirection(currentDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setCurrentSortKey(key);
            setCurrentDirection('asc');
        }
    };

    return {
        currentSortKey,
        currentDirection,
        handleSort,
    };
};
