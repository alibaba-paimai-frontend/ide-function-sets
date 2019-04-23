import { Instance } from 'mobx-state-tree';
import { initSuitsFromConfig } from 'ide-lib-engine';

export * from './FunctionSets/config';
export * from './FunctionSets/';

import { FunctionSetsCurrying } from './FunctionSets/';
import { configFunctionSets } from './FunctionSets/config';

const {
  ComponentModel: FunctionSetsModel,
  NormalComponent: FunctionSets,
  ComponentHOC: FunctionSetsHOC,
  ComponentAddStore: FunctionSetsAddStore,
  ComponentFactory: FunctionSetsFactory
} = initSuitsFromConfig(FunctionSetsCurrying,configFunctionSets);

export {
  FunctionSetsModel,
  FunctionSets,
  FunctionSetsHOC,
  FunctionSetsAddStore,
  FunctionSetsFactory
};

export interface IFunctionSetsModel
  extends Instance<typeof FunctionSetsModel> {}
