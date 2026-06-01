import { render, screen } from '@testing-library/react';

import TeaEditCard from '@/components/teaEditCard';
import { getStubTea } from '@test/tea';

import { editTea } from './actions';
import EditTeaForm from './editTeaForm';

vi.mock('@/components/teaEditCard', () => ({
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

        // act
        render(<EditTeaForm tea={tea} />);

        // assert
        expect(mockTeaEditCard).toHaveBeenCalledWith(
            {
                title: 'Edit Tea',
                initialState: {
                    values: tea,
                    errors: {},
                },
                action: expect.any(Function),
            },
            undefined,
        );
        expect(screen.getByText('Mocked TeaEditCard')).toBeInTheDocument();
    });

    it('should bind editTea action with tea id', () => {
        // arrange
        const tea = getStubTea();

        render(<EditTeaForm tea={tea} />);

        // act
        const passedAction = mockTeaEditCard.mock.calls[0][0].action;
        void passedAction(null, new FormData());

        // assert
        expect(mockEditTea).toHaveBeenCalledWith(
            tea.id,
            null,
            expect.any(FormData),
        );
    });
});
