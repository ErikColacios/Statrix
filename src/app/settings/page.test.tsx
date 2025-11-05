import { render, screen, waitFor } from '@testing-library/react'
import Settings from './page'

// Mock de react-dom/useFormState
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: () => [null, async () => {}],
}))

// ✅ Mock de las acciones del servidor
jest.mock('@/actions/getSessionUser', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({ user_name: 'TestUser' }),
}))

jest.mock('@/actions/getUserInfo', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue([
    {
      user_name: 'TestUser',
      user_email: 'test@example.com',
      user_location: 'Madrid',
      user_webpage: 'example.com',
      user_steam: '',
      user_twitch: '',
      user_x: '',
      user_bio: 'Hello world',
      user_creationdate: new Date('2024-01-01'),
      avatar_image: 'avatar.png',
      banner_image: 'banner.png',
      avatar_image_id: 1,
      banner_image_id: 2,
    },
  ]),
}))

jest.mock('@/actions/updateUser', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// ✅ Mock de componentes secundarios (no críticos)
jest.mock('@/components/ChooseAvatarBanner', () => () => <div>Mock ChooseAvatarBanner</div>)
jest.mock('@/components/PrimaryButton', () => (props: any) => <button>{props.text}</button>)

describe('Settings Page', () => {
  it('renderiza correctamente los datos del usuario', async () => {
    render(<Settings />)

    // Espera a que useEffect resuelva la promesa
    await waitFor(() => {
      expect(screen.getByDisplayValue('TestUser')).toBeInTheDocument()
    })

    // Comprueba algunos campos visibles
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('TestUser')).toBeInTheDocument()
    expect(screen.getByText('Save changes')).toBeInTheDocument()
  })
})
