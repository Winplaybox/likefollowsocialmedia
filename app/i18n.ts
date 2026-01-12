import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {Language, NameSpace} from './types/Enums';

import enUSCommon from './locales/en-US/common.json';
import frCACommon from './locales/fr-CA/common.json';

const resources = {
    [Language.ENGLISH_US]: {
        [NameSpace.Common]: enUSCommon,
    },
    [Language.FRENCH_CA]: {
        [NameSpace.Common]: frCACommon,
    },
};

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: Language.ENGLISH_US,
    ns: Object.values(NameSpace),
    interpolation: {
        escapeValue: false,
    },
    supportedLngs: Object.values(Language),
});

export default i18n;
