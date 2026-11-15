// Nocturne's own tokens, added on top of Elevate's defaults (see config/design.ts).

// Faces, loaded from Google Fonts in the page head
export const faces = {
  signage: "'Big Shoulders Display', 'Arial Narrow', sans-serif",
  grotesk: "'Schibsted Grotesk', ui-sans-serif, system-ui, sans-serif",
  board: "'Martian Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};

// One poster size above display, for the condensed signage face
export const sizes = {
  poster: 'clamp(4rem, 0.5rem + 12vw, 11rem)',
  // The footer wordmark: a quarter of the screen, whatever its width
  giant: 'clamp(5rem, 24vw, 20rem)',
};

// The night palette
export const nightColors = {
  midnight: '#070A1F', // the sky, and the page
  night: '#0E1433', // raised surfaces
  rail: '#262E5C', // lines and rules on the night
  haze: '#A9AFD0', // secondary text on the night
  lamp: '#FFB52E', // sodium lamps and the departure board
  ticket: '#F3EEE4', // the paper of a ticket
};

// Night to dawn, the length of the line
const route = '#5560F5 0%, #9041FF 38%, #D3278A 70%, #FFB52E 100%';

export const nightGradients = {
  'nightline-x': `linear-gradient(90deg, ${route})`,
  'nightline-y': `linear-gradient(180deg, ${route})`,
  starfield: [
    'radial-gradient(1px 1px at 12% 18%, #FFFFFFCC 50%, transparent)',
    'radial-gradient(1px 1px at 27% 62%, #FFFFFF99 50%, transparent)',
    'radial-gradient(1.5px 1.5px at 41% 9%, #FFFFFF 50%, transparent)',
    'radial-gradient(1px 1px at 58% 41%, #FFFFFFAA 50%, transparent)',
    'radial-gradient(1px 1px at 66% 77%, #FFFFFF88 50%, transparent)',
    'radial-gradient(1.5px 1.5px at 79% 23%, #FFFFFFDD 50%, transparent)',
    'radial-gradient(1px 1px at 88% 58%, #FFFFFF99 50%, transparent)',
    'radial-gradient(1px 1px at 94% 12%, #FFFFFFBB 50%, transparent)',
    'radial-gradient(1px 1px at 6% 83%, #FFFFFF77 50%, transparent)',
    'radial-gradient(1px 1px at 35% 88%, #FFFFFF66 50%, transparent)',
    'radial-gradient(ellipse 80% 60% at 70% 110%, #D3278A33, transparent 70%)',
    'radial-gradient(ellipse 60% 50% at 15% 0%, #5560F526, transparent 70%)',
    'linear-gradient(180deg, #070A1F 0%, #0B1030 100%)',
  ].join(', '),
  daybreak: 'linear-gradient(180deg, #070A1F 0%, #1A1550 45%, #6B1D5C 78%, #C2452F 100%)',
  wordmark: 'linear-gradient(180deg, #A9AFD0 0%, #D3278A 62%, #FFB52E 100%)',
};
