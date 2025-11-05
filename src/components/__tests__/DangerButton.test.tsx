import { fireEvent, render, screen } from "@testing-library/react";
import DangerButton from "../DangerButton";

describe('DangerButton', ()=>{

    it('should render the button and fire the click event', ()=> {
        // Arrange
        const buttonText = 'Danger button'
        const handleClick = jest.fn()

        // Act
        render(<DangerButton text={buttonText} onClick={handleClick}/>)
        const buttonElement = screen.getByText(buttonText)

        // Assert
        expect(buttonElement).toBeInTheDocument()
        fireEvent.click(buttonElement)
        fireEvent.click(buttonElement)
        expect(handleClick).toHaveBeenCalledTimes(2)
    })
})