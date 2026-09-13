import * as migration_20260913_145803_initial from './20260913_145803_initial';

export const migrations = [
  {
    up: migration_20260913_145803_initial.up,
    down: migration_20260913_145803_initial.down,
    name: '20260913_145803_initial'
  },
];
