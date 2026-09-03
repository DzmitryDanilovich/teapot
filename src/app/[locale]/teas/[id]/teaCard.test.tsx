import { act, render } from '@testing-library/react';

import i18nProvider from '@test/i18nProvider';
import { getStubTea } from '@test/tea';

import EditTeaForm from './editTeaForm';
import ShowTeaCard from './showTeaCard';
import TeaCard from './teaCard';

vi.mock('./editTeaForm', () => ({
    default: vi.fn(() => <div>Mocked EditTeaForm</div>),
}));

const mockEditTeaForm = vi.mocked(EditTeaForm);

vi.mock('./showTeaCard', () => ({
    default: vi.fn(() => <div>Mocked ShowTeaCard</div>),
}));

const mockShowTeaCard = vi.mocked(ShowTeaCard);

describe('TeaCard', () => {
    it('should render the tea card with tea details', () => {
        // arrange
        const tea = getStubTea();

        // act
        render(<TeaCard tea={tea} />, { wrapper: i18nProvider });

        // assert
        expect(mockShowTeaCard).toHaveBeenCalledWith(
            { tea, onEdit: expect.any(Function) },
            undefined,
        );
    });

    it('should switch to edit mode when edit button is clicked', () => {
        // arrange
        const tea = getStubTea();

        render(<TeaCard tea={tea} />, { wrapper: i18nProvider });
        const onEdit = mockShowTeaCard.mock.calls[0][0].onEdit;

        // act
        act(() => {
            onEdit();
        });

        // assert
        expect(mockEditTeaForm).toHaveBeenCalledWith({ tea }, undefined);
    });
});
