<template>
    <div :style="{ ...toolbarDefaultStyle, ...toolbarStyle }">
        <Space>
            <Space.Compact block>
                <Popover content="快捷键">
                    <Button icon="key" />
                </Popover>
            </Space.Compact>
            <Space.Compact block>
                <Popover content="放大">
                    <Button icon="zoom-in" />
                </Popover>
                <Popover content="缩小">
                    <Button icon="zoom-out" />
                </Popover>
            </Space.Compact>
            <Space.Compact block>
                <Popover content="重做">
                    <Button icon="reload" />
                </Popover>
                <Popover content="撤销">
                    <Button icon="redo" />
                </Popover>
            </Space.Compact>
            <Space.Compact block>
                <Popover content="导入xml文件">
                    <Upload accept=".xml" :showUploadList="false">
                        <Button icon="folder-open"></Button>
                    </Upload>
                </Popover>
                <Popover content="预览">
                    <Button icon="eye" />
                </Popover>
                <Popover>
                    <template #content>
                        <Button type="link" style="color: #2c3e50;border-bottom: 1px solid">下载为XML</Button><br>
                        <Button type="link" style="color: #2c3e50">下载为PNG</Button>
                    </template>
                    <Button icon="download"/>
                </Popover>
            </Space.Compact>
            <Popover content="保存更新">
                <Button icon="save" />
            </Popover>
            <Button type="link" style="color: GrayText" size="large">{{ title }}</Button>
        </Space>
    </div>
</template>
<script>
import { toolbarDefaultStyle } from './props';
import 'ant-design-vue/dist/antd.css';
import Button from 'ant-design-vue/lib/button';
import Space from 'ant-design-vue/lib/space';
import Popover from 'ant-design-vue/lib/popover';
import Upload from 'ant-design-vue/lib/upload';
export default {
    name: 'EasyFlowableToolbar',
    components: {
        Space, Popover, Button, Upload
    },
    props: {
        toolbarStyle: {
            type: Object,
            default: () => {}
        },
        title: {
            type: String,
            default: 'Easy-Flowable流程设计器'
        }
    },
    data() {
        return {
            toolbarDefaultStyle,
        }
    },
    methods: {

    }
}
</script>
