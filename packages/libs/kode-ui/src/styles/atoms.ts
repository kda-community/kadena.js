import { createSprinkles } from '@vanilla-extract/sprinkles';
import { responsiveProperties, systemProperties } from './atoms.css';

export const atoms = createSprinkles(systemProperties, responsiveProperties);

export type Atoms = Parameters<typeof atoms>[0];
