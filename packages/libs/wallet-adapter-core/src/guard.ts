/*
 * Pact types
 *
 * https://gist.github.com/jmcardon/4290533dc950fe49ebe5c4feee342ba0
 */

export type ModuleName = { name: string; namespace?: string };
export type PvInteger = { int: number | string };
export type PvDecimal = number | { decimal: string };
export type PvLiteral = string | PvInteger | PvDecimal | boolean;
export type PvList = PactValue[];
export type PvObject = { [key: string]: PactValue };
export type PvModRef = { refName: string; refSpec: ModuleName[] };
export type PvTime = { time: string } | { timep: string };
export type PvCapToken = { ctName: string; ctArgs: PactValue[] };
export type PactValue =
  | PvLiteral
  | PvList
  | Guard
  | PvObject
  | PvModRef
  | PvTime
  | PvCapToken;

export type KeySet = {
  keys: string[];
  pred: string;
};

export type KeySetRef = {
  keysetref: {
    ns?: string;
    ksn: string;
  };
};

export type UserGuard = {
  fun: string;
  args: PactValue[];
};

export type CapabilityGuard = {
  cgName: string;
  cgArgs: PactValue[];
  cgPactId?: string;
};

export type ModuleGuard = {
  moduleName: ModuleName;
  name: string;
};

export type PactGuard = {
  pactId: string;
  name: string;
};

export type Guard =
  | KeySet
  | KeySetRef
  | UserGuard
  | CapabilityGuard
  | ModuleGuard
  | PactGuard;

export const isKeySetGuard = (guard: Guard): guard is KeySet => {
  return 'keys' in guard && 'pred' in guard;
};

export const isKeySetRefGuard = (guard: Guard): guard is KeySetRef => {
  return 'keysetref' in guard;
};

export const isUserGuard = (guard: Guard): guard is UserGuard => {
  return 'fun' in guard && 'args' in guard;
};

export const isCapabilityGuard = (guard: Guard): guard is CapabilityGuard => {
  return 'cgName' in guard && 'cgArgs' in guard;
};

export const isModuleGuard = (guard: Guard): guard is ModuleGuard => {
  return 'moduleName' in guard && 'name' in guard;
};

export const isPactGuard = (guard: Guard): guard is PactGuard => {
  return 'pactId' in guard && 'name' in guard;
};
