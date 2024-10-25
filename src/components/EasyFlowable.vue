<template>
    <div style="width: 100%; overflow: hidden;position: relative">
        <toolbar
            v-if="modeler != null"
            :modeler="modeler"
            :is-base64="toolbarBase64"
            :toolbar-style="toolbarStyle"
            :bpmn-data="bpmnData"
            @save="(data) => this.$emit('save', data)"
            @uploadXml="changeValue"
            :title="toolbarTitle"/>
        <div id="bpmn-container" :style="{ ...bpmnDefaultStyle, ...bpmnStyle }"/>
        <properties-panel v-if="modeler != null" :modeler="modeler" @bpmn-change="bpmnInfoChange"/>
    </div>

</template>
<script>
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { zhTranslateModule } from './modules';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {bpmnDefaultStyle, xmlStr} from './props';
import Toolbar from "./Toolbar";
import PropertiesPanel from "./PropertiesPanel";
export default {
    name: 'EasyFlowable',
    components: { Toolbar, PropertiesPanel },
    props: {
        bpmnStyle: {
            type: Object,
            default: () => {}
        },
        toolbarStyle: {
            type: Object,
            default: () => {
            }
        },
        toolbarTitle: {
            type: String,
            default: 'Easy-Flowable流程设计器'
        },
        toolbarBase64: [Boolean],
        height: [String, Number],
        align: {
            validate: (value) => ['default', 'align'].indexOf(value) !== -1,
            default: 'default'
        },
        value: {
            type: String,
            default: () => xmlStr()
        },
        flowKey: {
            type: String,
            default: 'easy-flowable-custom'
        },
        flowName: {
            type: String,
            default: '流程设计器',
        },
        author: {
            type: String,
            default: 'easy-flowable'
        }
    },
    data() {
        return {
            bpmnDefaultStyle,
            modeler: null,
            bpmnData: {
                name: this.flowName, description: '', author: this.author
            },
        }
    },
    mounted() {
        const bpmn = new BpmnModeler({
            container: '#bpmn-container',
            height: `${this.height || 60}vh`,
            additionalModules: [zhTranslateModule],
            keyboard: {
                bindTo: document
            },
            bpmnRenderer: {
                defaultLabelColor: "#000",
                defaultFillColor: '#eef4ff',
                defaultStrokeColor: '#349afa'
            },
            textRenderer: {
                defaultStyle: {
                    fontFamily: '"Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"',
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                }
            },
        });
        // 定位到中间
        bpmn.on("import.done", () => {
            const canvas = bpmn.get('canvas');
            if (this.align === 'center') {
                canvas.zoom('fit-viewport', 'auto');
            }
        });
        this.modeler = bpmn;
        // 装载xml
        let value = this.value;
        if (!this.value) {
            value = xmlStr();
            this.changeValue(value);
        }
        bpmn.importXML(value).then(() => {
            console.log("import xml success!")
        }).catch((err) => console.log("import xml error: ", err))
    },
    watch: {
        value: {
            handler(val) {
                if (val && this.modeler) {
                    this.modeler.importXML(val);
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        changeValue(value) {
            this.$emit('input', value);
            this.$emit('on-change', value);
        },
        bpmnInfoChange(value) {
            this.bpmnData = { ...this.bpmnData, ...value };
        }
    }
}
</script>
<style scoped>
/*左侧工具栏*/
/deep/.djs-palette {
    background: transparent;
    border: 1px solid #eee;
}

/* 节点点击后出现的工具栏*/
/deep/.djs-context-pad .entry {
    background-color: transparent;
    box-shadow: 0 0 0 0;
}

</style>
