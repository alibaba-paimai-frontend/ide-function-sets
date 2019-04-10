import { cast, types, Instance, IAnyModelType } from 'mobx-state-tree';

import { quickInitModel } from 'ide-lib-engine';

import { uuid } from '../../lib/util';

/**
 * 单个函数模型，借此绑定该组件的多种函数
 */
export const FuncModel: IAnyModelType = quickInitModel('FuncModel', {
  id: types.refinement(
    types.identifier,
    (identifier: string) => identifier.indexOf(`fn_`) === 0
  ), // 创建之后不要让用户层面轻易看到或更改，用于程序内部的关联关系;
  name: types.optional(types.string, ''), // 这个是函数 name，是可以被更改的
  body: types.optional(types.string, '') // 函数体
}).views(self => ({
  get definition() {
    // 获取函数定义
    return `window['${self.name}'] = ${self.body}`;
  }
}));

export interface IFuncModel extends Instance<typeof FuncModel> {}
