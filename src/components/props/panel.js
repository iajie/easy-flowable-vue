/**
 * 获取节点类型
 * @returns
 * @param node
 */
export const nodeType = (node) => {
    if (node && node.$type) {
        if (node.$type.startsWith('bpmn:')) {
            return node.$type.substring(5);
        }
        return node.$type;
    }
    return false;
}

/**
 * 解析EL表达式
 * @param value
 * @returns {boolean|boolean|*|string}
 */
export const elDecoder = (value) => value.startsWith('<![CDATA[') && value.substring(value.indexOf(' ') + 1, value.lastIndexOf(' '));
