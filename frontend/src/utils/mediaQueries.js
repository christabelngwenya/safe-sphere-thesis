// src/utils/mediaQueries.js
import { css } from 'styled-components';

// Option 1: Named export (recommended)
export const device = {
  sm: (...args) => css`
    @media (max-width: 480px) {
      ${css(...args)}
    }
  `,
  md: (...args) => css`
    @media (max-width: 768px) {
      ${css(...args)}
    }
  `,
  lg: (...args) => css`
    @media (max-width: 1024px) {
      ${css(...args)}
    }
  `,
  xl: (...args) => css`
    @media (max-width: 1200px) {
      ${css(...args)}
    }
  `,
};

// Option 2: Or as default export
// export default device;