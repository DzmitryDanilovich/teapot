import type { Locale, Messages } from '@messages/types';

declare module 'next-intl' {
    interface AppConfig {
        Locale: Locale;
        Messages: Messages;
    }
}
