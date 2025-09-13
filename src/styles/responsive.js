import { css } from 'styled-components';
import { theme } from './theme';

// Медиа-запросы для адаптивности
export const media = {
  sm: (...args) => css`
    @media (max-width: ${theme.breakpoints.sm}) {
      ${css(...args)}
    }
  `,
  md: (...args) => css`
    @media (max-width: ${theme.breakpoints.md}) {
      ${css(...args)}
    }
  `,
  lg: (...args) => css`
    @media (max-width: ${theme.breakpoints.lg}) {
      ${css(...args)}
    }
  `,
  xl: (...args) => css`
    @media (max-width: ${theme.breakpoints.xl}) {
      ${css(...args)}
    }
  `,
  '2xl': (...args) => css`
    @media (max-width: ${theme.breakpoints['2xl']}) {
      ${css(...args)}
    }
  `,
  minSm: (...args) => css`
    @media (min-width: ${theme.breakpoints.sm}) {
      ${css(...args)}
    }
  `,
  minMd: (...args) => css`
    @media (min-width: ${theme.breakpoints.md}) {
      ${css(...args)}
    }
  `,
  minLg: (...args) => css`
    @media (min-width: ${theme.breakpoints.lg}) {
      ${css(...args)}
    }
  `,
  minXl: (...args) => css`
    @media (min-width: ${theme.breakpoints.xl}) {
      ${css(...args)}
    }
  `,
  min2Xl: (...args) => css`
    @media (min-width: ${theme.breakpoints['2xl']}) {
      ${css(...args)}
    }
  `
};

// Утилиты для адаптивных отступов
export const responsiveSpacing = {
  xs: css`
    padding: ${theme.spacing.xs};
    ${media.sm`
      padding: ${theme.spacing.xs};
    `}
  `,
  sm: css`
    padding: ${theme.spacing.sm};
    ${media.sm`
      padding: ${theme.spacing.xs};
    `}
  `,
  md: css`
    padding: ${theme.spacing.md};
    ${media.sm`
      padding: ${theme.spacing.sm};
    `}
  `,
  lg: css`
    padding: ${theme.spacing.lg};
    ${media.md`
      padding: ${theme.spacing.md};
    `}
    ${media.sm`
      padding: ${theme.spacing.sm};
    `}
  `,
  xl: css`
    padding: ${theme.spacing.xl};
    ${media.lg`
      padding: ${theme.spacing.lg};
    `}
    ${media.md`
      padding: ${theme.spacing.md};
    `}
    ${media.sm`
      padding: ${theme.spacing.sm};
    `}
  `
};

// Утилиты для адаптивных размеров шрифта
export const responsiveFontSize = {
  xs: css`
    font-size: ${theme.typography.fontSize.xs};
    ${media.sm`
      font-size: ${theme.typography.fontSize.xs};
    `}
  `,
  sm: css`
    font-size: ${theme.typography.fontSize.sm};
    ${media.sm`
      font-size: ${theme.typography.fontSize.xs};
    `}
  `,
  base: css`
    font-size: ${theme.typography.fontSize.base};
    ${media.sm`
      font-size: ${theme.typography.fontSize.sm};
    `}
  `,
  lg: css`
    font-size: ${theme.typography.fontSize.lg};
    ${media.md`
      font-size: ${theme.typography.fontSize.base};
    `}
    ${media.sm`
      font-size: ${theme.typography.fontSize.sm};
    `}
  `,
  xl: css`
    font-size: ${theme.typography.fontSize.xl};
    ${media.lg`
      font-size: ${theme.typography.fontSize.lg};
    `}
    ${media.md`
      font-size: ${theme.typography.fontSize.base};
    `}
    ${media.sm`
      font-size: ${theme.typography.fontSize.sm};
    `}
  `,
  '2xl': css`
    font-size: ${theme.typography.fontSize['2xl']};
    ${media.lg`
      font-size: ${theme.typography.fontSize.xl};
    `}
    ${media.md`
      font-size: ${theme.typography.fontSize.lg};
    `}
    ${media.sm`
      font-size: ${theme.typography.fontSize.base};
    `}
  `,
  '3xl': css`
    font-size: ${theme.typography.fontSize['3xl']};
    ${media.xl`
      font-size: ${theme.typography.fontSize['2xl']};
    `}
    ${media.lg`
      font-size: ${theme.typography.fontSize.xl};
    `}
    ${media.md`
      font-size: ${theme.typography.fontSize.lg};
    `}
    ${media.sm`
      font-size: ${theme.typography.fontSize.base};
    `}
  `,
  '4xl': css`
    font-size: ${theme.typography.fontSize['4xl']};
    ${media.xl`
      font-size: ${theme.typography.fontSize['3xl']};
    `}
    ${media.lg`
      font-size: ${theme.typography.fontSize['2xl']};
    `}
    ${media.md`
      font-size: ${theme.typography.fontSize.xl};
    `}
    ${media.sm`
      font-size: ${theme.typography.fontSize.lg};
    `}
  `
};

// Утилиты для адаптивных сеток
export const responsiveGrid = {
  autoFit: (minWidth = '250px') => css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
    gap: ${theme.spacing.lg};
    
    ${media.md`
      gap: ${theme.spacing.md};
    `}
    
    ${media.sm`
      grid-template-columns: 1fr;
      gap: ${theme.spacing.sm};
    `}
  `,
  autoFill: (minWidth = '250px') => css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${minWidth}, 1fr));
    gap: ${theme.spacing.lg};
    
    ${media.md`
      gap: ${theme.spacing.md};
    `}
    
    ${media.sm`
      grid-template-columns: 1fr;
      gap: ${theme.spacing.sm};
    `}
  `,
  columns: (columns) => css`
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: ${theme.spacing.lg};
    
    ${media.lg`
      grid-template-columns: repeat(${Math.min(columns, 2)}, 1fr);
    `}
    
    ${media.sm`
      grid-template-columns: 1fr;
    `}
  `
};

// Утилиты для адаптивных flex-контейнеров
export const responsiveFlex = {
  row: css`
    display: flex;
    flex-direction: row;
    gap: ${theme.spacing.md};
    
    ${media.sm`
      flex-direction: column;
      gap: ${theme.spacing.sm};
    `}
  `,
  column: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    
    ${media.sm`
      gap: ${theme.spacing.sm};
    `}
  `,
  wrap: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing.md};
    
    ${media.sm`
      gap: ${theme.spacing.sm};
    `}
  `,
  center: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  between: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    ${media.sm`
      flex-direction: column;
      align-items: flex-start;
      gap: ${theme.spacing.sm};
    `}
  `,
  around: css`
    display: flex;
    align-items: center;
    justify-content: space-around;
    
    ${media.sm`
      flex-direction: column;
      gap: ${theme.spacing.sm};
    `}
  `
};

// Утилиты для скрытия/показа элементов
export const responsiveVisibility = {
  hideOnMobile: css`
    ${media.sm`
      display: none !important;
    `}
  `,
  showOnMobile: css`
    display: none;
    
    ${media.sm`
      display: block;
    `}
  `,
  hideOnTablet: css`
    ${media.md`
      display: none !important;
    `}
  `,
  showOnTablet: css`
    display: none;
    
    ${media.md`
      display: block;
    `}
  `,
  hideOnDesktop: css`
    ${media.minLg`
      display: none !important;
    `}
  `,
  showOnDesktop: css`
    display: none;
    
    ${media.minLg`
      display: block;
    `}
  `
};

// Утилиты для адаптивных контейнеров
export const responsiveContainer = {
  full: css`
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};
    
    ${media.md`
      padding: 0 ${theme.spacing.md};
    `}
    
    ${media.sm`
      padding: 0 ${theme.spacing.sm};
    `}
  `,
  wide: css`
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};
    
    ${media.md`
      padding: 0 ${theme.spacing.md};
    `}
    
    ${media.sm`
      padding: 0 ${theme.spacing.sm};
    `}
  `,
  standard: css`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};
    
    ${media.md`
      padding: 0 ${theme.spacing.md};
    `}
    
    ${media.sm`
      padding: 0 ${theme.spacing.sm};
    `}
  `,
  narrow: css`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};
    
    ${media.md`
      padding: 0 ${theme.spacing.md};
    `}
    
    ${media.sm`
      padding: 0 ${theme.spacing.sm};
    `}
  `
};

export default {
  media,
  responsiveSpacing,
  responsiveFontSize,
  responsiveGrid,
  responsiveFlex,
  responsiveVisibility,
  responsiveContainer
};
