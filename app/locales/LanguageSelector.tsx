import React from 'react';
import {useTranslation} from 'react-i18next';
import {NameSpace} from '../types/Enums';
import {LanguageOptions} from './languageOptions';

const LanguageSelector: React.FC = () => {
    const {i18n} = useTranslation();
    const {t} = useTranslation(NameSpace.Common);
    const currentLanguage = i18n.language;
    const languages = React.useMemo(() => LanguageOptions(t), [t]);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
        localStorage.setItem('i18nextLng', e.target.value);

        const event = new CustomEvent('languageChanged', {detail: e.target.value});
        window.dispatchEvent(event);
    };
    return (
        <select
            value={currentLanguage}
            onChange={handleLanguageChange}
            className='ml-4 px-3 py-2 rounded border border-white/10 bg-black/50 text-white'
            data-testid='language-select'
        >
            {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                    {lang.text}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelector;
