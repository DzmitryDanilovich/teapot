/* eslint-disable import/order */
import en from './en.json';
import pl from './pl.json';
import be from './be.json';
import ru from './ru.json';

import { LOCALES, DEFAULT_LOCALE } from './constants';

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

pl satisfies Widen<typeof en>;
be satisfies Widen<typeof en>;
ru satisfies Widen<typeof en>;

en satisfies Widen<typeof pl>;
en satisfies Widen<typeof be>;
en satisfies Widen<typeof ru>;

export type Locale = (typeof LOCALES)[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const locales = { en, pl, be, ru } satisfies Record<Locale, unknown>;

export type Messages = (typeof locales)[typeof DEFAULT_LOCALE];
