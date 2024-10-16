<template>
    <div :style="{ ...toolbarDefaultStyle }">
        <Space>
            <Popover content="快捷键">
                <Button icon="key"/>
            </Popover>
            <Popover @click="() => onZoom(true)" content="放大">
                <Button icon="zoom-in"/>
            </Popover>
            <Popover content="缩小">
                <Button @click="() => onZoom()" icon="zoom-out"/>
            </Popover>
            <Popover content="重做">
                <Button @click="() => modeler.get('commandStack').redo()" icon="reload"/>
            </Popover>
            <Popover content="撤销">
                <Button @click="() => modeler.get('commandStack').undo()" icon="redo"/>
            </Popover>
            <Popover content="导入xml文件">
                <Upload accept=".xml" :beforeUpload="uploadChange" :showUploadList="false">
                    <Button icon="folder-open"></Button>
                </Upload>
            </Popover>
            <Popover content="预览">
                <Button @click="viewFile" icon="eye" />
            </Popover>
            <Popover v-model="visible" trigger="click">
                <template #content>
                    <Button type="link" style="color: #2c3e50;border-bottom: 1px solid" @click="downloadXml">下载为XML</Button>
                    <br>
                    <Button type="link" style="color: #2c3e50" @click="downloadPng">下载为PNG</Button>
                </template>
                <Button icon="download"/>
            </Popover>
            <Popover content="保存更新">
                <Button icon="save" @click="onSave"/>
            </Popover>
            <Button type="link" style="color: GrayText" size="large">{{ title }}</Button>
        </Space>

    </div>
</template>
<script>
import {toolbarDefaultStyle} from './props';
import 'ant-design-vue/dist/antd.css';
import Button from 'ant-design-vue/lib/button';
import Space from 'ant-design-vue/lib/space';
import Popover from 'ant-design-vue/lib/popover';
import Upload from 'ant-design-vue/lib/upload';
import Modal from 'ant-design-vue/lib/modal';
import Message from 'ant-design-vue/lib/message';
import BpmnModeler from 'bpmn-js/lib/Modeler';

export default {
    name: 'EasyFlowableToolbar',
    components: {
        Space, Popover, Button, Upload
    },
    props: {
        title: {
            type: String,
            default: 'Easy-Flowable流程设计器'
        },
        modeler: [BpmnModeler],
        isBase64: [Boolean],
        bpmnData: {
            type: Object,
            default: () => ({ name: '', description: '', author: 'easy-flowable' })
        },
    },
    data() {
        return {
            toolbarDefaultStyle,
            /**
             * 是否显示气泡
             */
            visible: false,
            viewVisible: false,
            zoomValue: 1
        }
    },
    methods: {
        downloadXml() {
            this.modeler.saveXML({format: true}).then(({xml}) => {
                if (xml) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xml, 'text/xml');
                    const xmlSerializer = new XMLSerializer().serializeToString(xmlDoc.documentElement);
                    const a = document.createElement('a');
                    a.download = `${this.title || 'easy-flowable'}.xml`;
                    a.href = `data:text/xml;charset=utf-8,${encodeURIComponent(xmlSerializer)}`;
                    a.click();
                }
                this.visible = false;
            });
        },
        downloadPng() {
            this.downloadSvg();
            this.visible = false;
        },
        /**
         * 是否下载
         * @param base64
         */
        downloadSvg(base64) {
            // svg字符串
            this.modeler.saveSVG().then((res) => {
                // 创建画布
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (context) {
                    context.fillStyle = '#fff';
                    context.fillRect(0, 0, 10000, 10000);
                    const image = new Image();
                    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(res.svg)}`;
                    image.onload = () => {
                        canvas.width = image.width + 100;
                        canvas.height = image.height + 100;
                        const x = (canvas.width - image.width) / 2;
                        const y = (canvas.height - image.height) / 2;
                        // 将图片渲染到画布
                        context.drawImage(image, x, y);
                        const logo = new Image();
                        logo.src =
                            'data:image/png;base64,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';
                        logo.onload = () => {
                            context.drawImage(logo, image.width + 20, image.height + 45);
                            if (base64) {
                                base64(canvas.toDataURL('image/png'));
                            } else {
                                const a = document.createElement('a');
                                a.download = `easy-flowable${new Date().getSeconds()}.png`;
                                // 画布转图片
                                a.href = canvas.toDataURL('image/png');
                                a.click();
                            }
                        };
                    };
                }
            });
        },
        /**
         * 放大缩小
         * @param isIn 是否放大
         */
        onZoom(isIn = false) {
            if (isIn) {
                this.zoomValue = this.zoomValue + 0.05;
            } else {
                this.zoomValue = this.zoomValue - 0.05;
            }
            this.modeler.get('canvas').zoom(this.zoomValue);
        },
        /**
         * 保存方法
         */
        onSave() {
            this.modeler.saveXML({ format: true }).then((res) => {
                const data = { ...this.bpmnData };
                if (res.xml) {
                    data.xml = res.xml;
                    if (this.isBase64) {
                        this.downloadSvg((base64) => data.base64 = base64);
                    }
                    this.$emit('save', data);
                }
            });
        },
        uploadChange(file) {
            if (file.type === 'text/xml') {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (e) => {
                    this.$emit('uploadXml', e.target.result);
                };
            }
            return false;
        },
        viewFile() {
            this.modeler.saveXML({format: true}).then(({xml}) => {
                if (xml) {
                    Modal.confirm({
                        centered: true, icon: 'copy', width: '60%',
                        title: 'XML源码预览', okText: '复制', cancelText: '返回',
                        content: xml,
                        onOk: async () => {
                            await navigator.clipboard.writeText(xml);
                            await Message.success('复制成功！');
                            return false;
                        }
                    });
                }
            });
        }
    }
}
</script>
