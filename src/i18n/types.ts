import { Messages, NamespaceKeys, NestedKeyOf } from 'next-intl';
import type { getTranslations } from 'next-intl/server';

export type Translator<
    NestedKey extends NamespaceKeys<Messages, NestedKeyOf<Messages>>,
> = Awaited<ReturnType<typeof getTranslations<NestedKey>>>;
