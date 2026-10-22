import { render, screen } from '@testing-library/react';

import TeaEditCard from '@/common/teaEditCard';
import i18nProvider from '@test/i18nProvider';
import { getStubTea, getStubTeaValues } from '@test/tea';

import { editTea } from './actions';
import EditTeaForm from './editTeaForm';

vi.mock('@/common/teaEditCard', () => ({
    default: vi.fn(() => <div>Mocked TeaEditCard</div>),
}));

const mockTeaEditCard = vi.mocked(TeaEditCard);

vi.mock('./actions', () => ({
    editTea: vi.fn(),
}));

const mockEditTea = vi.mocked(editTea);

describe('EditTeaForm', () => {
    it('should render the EditTeaForm with initial tea data', () => {
        // arrange
        const tea = getStubTea();
        const teaValues = getStubTeaValues();

        // act
        render(<EditTeaForm tea={tea} />, { wrapper: i18nProvider });

        // assert
        expect(mockTeaEditCard).toHaveBeenCalledWith(
            {
                title: 'Edit Tea',
                values: teaValues,
                action: expect.any(Function),
            },
            undefined,
        );
        expect(screen.getByText('Mocked TeaEditCard')).toBeInTheDocument();
    });

    it('should map empty tea data fields to form values', () => {
        // arrange
        const tea = getStubTea();
        const teaWithEmptyFields = {
            ...tea,
            type: null,
            origin: null,
            storeUrl: null,
        };

        // act
        render(<EditTeaForm tea={teaWithEmptyFields} />, {
            wrapper: i18nProvider,
        });

        // assert
        expect(mockTeaEditCard).toHaveBeenCalledWith(
            expect.objectContaining({
                values: {
                    name: teaWithEmptyFields.name,
                    type: undefined,
                    origin: undefined,
                    storeUrl: undefined,
                },
            }),
            undefined,
        );
    });

    it('should bind editTea action with tea id', () => {
        // arrange
        const tea = getStubTea();
        const teaValues = getStubTeaValues();

        render(<EditTeaForm tea={tea} />, { wrapper: i18nProvider });

        // act
        const passedAction = mockTeaEditCard.mock.calls[0][0].action;
        void passedAction(teaValues);

        // assert
        expect(mockEditTea).toHaveBeenCalledWith(tea.id, teaValues);
    });
});
