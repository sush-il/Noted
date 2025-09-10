interface BurgerMenuProps {
  color?: string; // optional, defaults to white
  isOpen: boolean
}

function BurgerMenu({ color = '#ffffff', isOpen }: BurgerMenuProps) {
  return (
    <svg
      className='h-6 w-6'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke={color} //'currentColor'
      aria-hidden='true'>
      {isOpen ? (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M6 18L18 6M6 6l12 12'
        />
      ) : (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M4 6h16M4 12h16m-7 6h7'
        />
      )}
    </svg>
  )
}

export default BurgerMenu;
