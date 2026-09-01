import { render, screen } from '@testing-library/react';

import { Tea } from '@/generated/prisma/browser';
import i18nProvider from '@test/i18nProvider';

import TeaList from './teaList';

describe('TeaList', () => {
    it('should render the tea list', () => {
        // arrange
        const teas: Tea[] = [
            {
                id: 'adf181fe-7132-459e-94fb-a67953ca5b13',
                name: 'Green Tea',
                type: 'green',
                origin: 'China',
                storeUrl: 'https://example.com/green-tea',
                userId: 'bf969878-2b77-46bd-acc0-43574e4e84a4',
                createdAt: new Date(),
            },
            {
                id: '8e538bdb-c3f4-4c2d-93cf-95683971aa62',
                name: 'Black Tea',
                type: 'black',
                origin: 'India',
                storeUrl: 'https://example.com/black-tea',
                userId: '0f545cb7-ddf5-4df8-a2a3-fc6d7dcbd007',
                createdAt: new Date(),
            },
        ];

        // act
        render(<TeaList teas={teas} />, { wrapper: i18nProvider });

        // assert
        expect(screen.getByText('Green Tea')).toBeInTheDocument();
        expect(screen.getByText('Black Tea')).toBeInTheDocument();
    });
});
