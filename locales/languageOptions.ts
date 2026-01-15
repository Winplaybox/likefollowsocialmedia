import {TFunction} from 'i18next';
import {Language} from '../types/Enums';

export interface LanguageItem {
    text: string;
    value: string;
}
const LANGUAGE_CONFIG: Record<Language, string> = {
    [Language.ENGLISH_US]: 'LanguageSelector.englishUS',
    [Language.FRENCH_CA]: 'LanguageSelector.frenchCA',
};

export const LanguageOptions = (t: TFunction): LanguageItem[] => {
    return Object.values(Language).map((langCode) => ({
        text: t(LANGUAGE_CONFIG[langCode]),
        value: langCode,
    }));
};
