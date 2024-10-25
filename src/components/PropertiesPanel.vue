<template>
    <ef-drawer
        :width="width"
        :visible="open"
        :mask="false"
        destroy-on-close
        :mask-closable="false"
        :get-container="false"
        @close="open = false"
        :wrap-style="{ position: 'absolute' }"
        :style="{ opacity: 0.7, ...drawerStyle }">
        <template #title>
            <ef-alert style="width: 90%" :message="`当前对象:` + nodeType(node)"/>
        </template>
        <ef-form :form="form" layout="horizontal" :label-col="{ span: 4 }">
            <ef-form-item label="标识" name="id">
                <ef-input readOnly style="width: 80%"/>
            </ef-form-item>
            <ef-form-item label="名称" name="name">
                <ef-input style="width: 80%"/>
            </ef-form-item>
            <ef-form-item v-if="nodeName('Process')" label="作者" name="author">
                <ef-input style="width: 80%"/>
            </ef-form-item>
<!--            <ef-form-item v-if="nodeName('SequenceFlow')" label="表达式" :name="['conditionExpression', 'body']" tooltip="条件表达式为EL表达式，结果需为true/false">-->
<!--                <ef-input style="width: 80%" type="textarea" />-->
<!--            </ef-form-item>-->

            <ef-form-item label="描述" name="description">
                <ef-input style="width: 80%" type="textarea" />
            </ef-form-item>
        </ef-form>
    </ef-drawer>
</template>

<script>
import Drawer from 'ant-design-vue/lib/drawer';
import { Form } from 'ant-design-vue';
import Input from 'ant-design-vue/lib/input';
import Alert from 'ant-design-vue/lib/alert';
import BpmnModeler from "bpmn-js/lib/Modeler";
import { nodeType, elDecoder } from './props/panel';
export default {
    components: {
        efDrawer: Drawer,
        efAlert: Alert,
        efForm: Form,
        efFormItem: Form.Item,
        efInput: Input,
    },
    props: {
        drawerStyle: [CSS],
        width: {
            type: Number,
            default: 400
        },
        modeler: [BpmnModeler],
        attrPrefix: {
            type: String,
            default: 'flowable:'
        }
    },
    mounted() {
        const eventBus = this.modeler.get('eventBus');
        // 加载后绑定 点击画布监听
        eventBus.on('element.click', (e) => this.changeCurrentElement(e.element));
        // // 节点改变更新事件
        eventBus.on('element.changed', (e) => {
            //忽略顺序流的修改
            if (nodeType(e.element) === "SequenceFlow") {
                return;
            }
            this.changeCurrentElement(e.element);
        });
    },
    data() {
        return {
            open: false,
            nodeType,
            node: null,
            form: this.$form.createForm(this, {}),
            script: '',
        }
    },
    methods: {
        changeCurrentElement(element) {
            // 获取元素节点信息
            const node = element.businessObject;
            this.node = node;
            const type = nodeType(node);
            // 弹出框--备注不需要属性设置
            if (type !== 'Association' && type !== 'TextAnnotation') {
                // 节点下多余属性
                const attrs = node.$attrs;
                const flowable = {};
                for (const key in attrs) {
                    if (Object.prototype.hasOwnProperty.call(attrs, key)) {
                        if (key.startsWith(this.attrPrefix)) {
                            // 获取表单key
                            const keyProps = key.substring(key.indexOf(this.attrPrefix) + 1);
                            flowable[keyProps] = attrs[key];
                        } else {
                            flowable[key] = attrs[key];
                        }
                    }
                }
                if (node?.conditionExpression && node.conditionExpression?.body) {
                    node.conditionExpression.body = elDecoder(node.conditionExpression.body);
                }
                // 多实例
                const loop = node.loopCharacteristics && node.loopCharacteristics.$attrs;
                if (loop) {
                    flowable.loopCharacteristics = {
                        collection: loop[`${this.attrPrefix}collection`],
                        elementVariable: loop[`${this.attrPrefix}elementVariable`],
                    }
                }
                if (node.script) {
                    this.script = node.script;
                }
                console.log(node, flowable);
                this.form.setFieldsValue({ ...node, ...flowable })
                this.open = true;
            } else {
                this.open = false;
            }
            console.log('点击节点', node)

        },
        nodeName(type) {
            return nodeType(this.node) === type;
        }
    }
}
</script>

<style scoped>

</style>
