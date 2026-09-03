import { NextIntlClientProvider } from 'next-intl';

import messages from '@messages/en.json';

const i18nProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextIntlClientProvider locale='en' messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
};

export default i18nProvider;
