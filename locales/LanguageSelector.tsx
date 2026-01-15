import Dropdown from '@/components/ui/Dropdown';
import {NameSpace} from '@/types/Enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {LanguageOptions} from './languageOptions';

const LanguageSelector: React.FC = () => {
    const {i18n} = useTranslation();
    const {t} = useTranslation(NameSpace.Common);
    const currentLanguage = i18n.language;
    const languages = React.useMemo(() => LanguageOptions(t), [t]);

    const handleLanguageChange = async (value: string) => {
        i18n.changeLanguage(value);
        await AsyncStorage.setItem('i18nextLng', value);
    };

    return (
        <View className='min-w-[160px]'>
            <Dropdown
                value={currentLanguage}
                options={languages.map((l) => ({value: l.value, label: l.text}))}
                onChange={handleLanguageChange}
                placeholder={t('app.language')}
            />
        </View>
    );
};

export default LanguageSelector;
