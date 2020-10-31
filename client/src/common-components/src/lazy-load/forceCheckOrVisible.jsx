import { forceCheck, forceVisible } from 'react-lazyload';

export function forceCheckOrVisible(isCheck, isVisible) {
    if (isCheck) {
        forceCheck();
    }

    if (isVisible) {
        forceVisible();
    }
}

