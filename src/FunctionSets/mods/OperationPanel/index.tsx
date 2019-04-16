import React, { useCallback, useRef } from 'react';
import { Button, message, Row, Col, Input, Icon, Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import { CodeEditor } from 'ide-code-editor';

import { StyledPanelWrap, StyledPanelHeader, StyledPanelBody } from './styles';

const confirm = Modal.confirm;

// TODO: 全屏功能
// TODO: 右侧滑动展出功能
// TODO: 透明遮罩功能
// TODO: 函数编辑，可以支持自定义组件功能

/**
 * 函数操作类型
 */
export enum EOperationType {
  ADD = 'ADD', // 新增
  DEL = 'DEL', // 删除
  EDIT = 'EDIT' // 编辑
}

export interface IOperationPanelProps {
  /**
   * 是否最大化
   */
  isMax?: boolean;

  /**
   * 最大化时的宽度，默认是屏幕宽度
   */
  maxWidth?: number;

  /**
   * 最大化时的高度，默认是屏幕高度
   */
  maxHeight?: number;

  /**
   * 容器高度
   */
  height?: number;

  /**
   * 容器宽度
   */
  width?: number;

  /**
   * 当前函数操作面板的类型
   */
  type: EOperationType;

  /**
   * 函数名
   */
  name?: string;

  /**
   * 函数内容
   */
  value?: string;

  /**
   * 点击确认提交（保存/删除）按钮时的回调
   */
  onSubmit?: (id: string, value: string, type: EOperationType) => void;
}

export const defaultProps: Partial<IOperationPanelProps> = {
  isMax: false,
  value: ''
};

/**
 * 确认删除函数的二次弹层
 *
 * @param {string} name - 函数名
 */
function showDeleteConfirm(name: string, onDelete: () => void) {
  confirm({
    title: '确认删除函数?',
    content: `确认删除函数 "${name}" 么？该操作不可恢复，请谨慎操作`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '我在想想',
    onOk() {
      onDelete && onDelete;
    }
  });
}

/**
 * 标题文案映射
 */
const titleTextMap: Record<EOperationType, string> = {
  ADD: '新增函数',
  EDIT: '编辑函数',
  DEL: '删除函数'
};

export const OperationPanel: React.FunctionComponent<
  IOperationPanelProps
> = observer(props => {
  const mergedProps = Object.assign({}, defaultProps, props);
  const { name, type, onSubmit, height, width } = mergedProps;

  const inputValueRef = useRef(name);

  const onClickSubmit = useCallback(() => {
    if (!inputValueRef.current) {
      message.error('函数名不能为空');
      return;
    }

    // 如果是删除操作，进行二次确认
    if (type === EOperationType.DEL) {
      showDeleteConfirm(name, () => {
        onSubmit && onSubmit(name, inputValueRef.current, type);
        return;
      });
    } else {
      onSubmit && onSubmit(name, inputValueRef.current, type);
    }
  }, [type, onSubmit]);

  const onInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    inputValueRef.current = e.target.value;
  }, []);

  return (
    <StyledPanelWrap style={{ width: width, height: height }} type={type}>
      <StyledPanelHeader type={type}>
        <span>{titleTextMap[type]}</span>
      </StyledPanelHeader>

      <StyledPanelBody>
        <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
          <Col span={8}>
            <Input
              prefix={<Icon type="file-text" style={{ fontSize: 14 }} />}
              placeholder="函数名"
              disabled={type !== EOperationType.ADD}
              defaultValue={name}
              onBlur={onInputBlur}
            />
          </Col>
          {type === EOperationType.EDIT &&
            ((
              <Col span={8} style={{ marginLeft: 14 }}>
                <Button type="primary" size="small">
                  编辑
                </Button>
              </Col>
            ) ||
              null)}
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={24}>
            <CodeEditor height={height! - 160} width={'100%'} value={''} />
          </Col>
        </Row>

        <Row type="flex" align="middle" justify="center">
          {type === EOperationType.DEL ? (
            <Button type="danger" onClick={onClickSubmit}>
              删除
            </Button>
          ) : (
            <Button type="primary" onClick={onClickSubmit}>
              保存
            </Button>
          )}

          <Button style={{ marginLeft: 10 }}>取消</Button>
        </Row>
      </StyledPanelBody>
    </StyledPanelWrap>
  );
});
