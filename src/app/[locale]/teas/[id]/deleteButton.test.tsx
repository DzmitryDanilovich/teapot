import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js';

import i18nProvider from '@test/i18nProvider';
import { stubTeaId } from '@test/tea';

import { deleteTea } from './actions';
import DeleteButton from './deleteButton';

vi.mock('./actions', () => ({
    deleteTea: vi.fn(),
}));

const mockDeleteTea = vi.mocked(deleteTea);

describe('DeleteButton', () => {
    it('should render the delete button', () => {
        // act
        render(<DeleteButton teaId='test-tea-id' />, { wrapper: i18nProvider });

        // assert
        expect(
            screen.getByRole('button', { name: 'Delete' }),
        ).toBeInTheDocument();
    });

    it('should delete tea on click', async () => {
        // arrange
        render(<DeleteButton teaId={stubTeaId} />, { wrapper: i18nProvider });

        // act
        const button = screen.getByRole('button', { name: 'Delete' });
        await userEvent.click(button);

        // assert
        expect(mockDeleteTea).toHaveBeenCalledWith(stubTeaId);
    });
});
