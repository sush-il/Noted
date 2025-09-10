interface IconProps {
  color?: string;
  size?: number; 
}

function NewNoteIcon ({ color = '#ffffff', size = 24 }: IconProps) {
  return (
    <svg fill="#000000" width={size} height={size} viewBox="0 0 24 24" id="create-note" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color">
      <g id="SVGRepo_bgCarrier" stroke-width="0"/>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
      <g id="SVGRepo_iconCarrier">
        
        {/* Pencil Outline */}
        <path id="secondary" d="M20,4a2.09,2.09,0,0,0-2.95.12L10.17,11,9,15l4-1.17L19.88,7A2.09,2.09,0,0,0,20,4Z" 
          style={{
            fill: 'none',
            stroke: color,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2
          }}
        />
        
        {/* Box outline */}
        <path id="primary" d="M12,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V12" 
          style={{
            fill: 'none',
            stroke: color,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2
          }} 
        />      
      </g>

    </svg>
  );
};

export default NewNoteIcon;
