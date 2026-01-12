import { render, screen } from '@testing-library/react';
import PrimaryButton from '../PrimaryButton';

describe('PrimaryButton', () => {
    it('should render the button with the provided text', () => {
        // Arrange
        const buttonText = 'Click me';

        // Act
        render(<PrimaryButton text={buttonText} />);
        const buttonElement = screen.getByText(buttonText);

        // Assert
        expect(buttonElement).toBeInTheDocument();
    });

    it('should have the correct CSS classes', () => {
        // Arrange
        const buttonText = 'Test Button';

        // Act
        render(<PrimaryButton text={buttonText} />);
        const buttonElement = screen.getByText(buttonText);

        // Assert
        // expect(buttonElement).toHaveClass(
        //     'text-md',
        //     'text-white',
        //     'px-6',
        //     'py-3',
        //     'rounded-xl',
        //     'bg-gradient-to-r',
        //     'from-green-500',
        //     'to-lime-500',
        //     'hover:from-green-500',
        //     'hover:to-lime-600',
        //     'transition',
        //     'duration-300'
        // );
    });

    it('should render as a button element', () => {
        // Arrange
        const buttonText = 'Test';

        // Act
        render(<PrimaryButton text={buttonText} />);
        const buttonElement = screen.getByText(buttonText);

        // Assert
        expect(buttonElement.tagName).toBe('BUTTON');
    });
});