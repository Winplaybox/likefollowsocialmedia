/**
 * Copyright (c) 2026 Winplaybox
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import {clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: any[]): ReturnType<typeof twMerge> {
    return twMerge(clsx(inputs));
}
export const BACKEND_URL_API = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`;
