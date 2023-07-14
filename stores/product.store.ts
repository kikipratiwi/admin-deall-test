import { atomWithStorage } from 'jotai/utils';

export const productFilterAtom = atomWithStorage('product_filter', {});
export const productSearchAtom = atomWithStorage('product_search', '');
