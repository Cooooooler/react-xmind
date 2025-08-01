import React, { useEffect, useRef, useState } from 'react';
import { Button, Layout, Space, message } from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import MindElixir from 'mind-elixir';
import type { MindElixirData, MindElixirInstance } from 'mind-elixir';
import { createStyles } from 'antd-style';
import { createMindMap } from './services/mindmap';
import MindMapList from './components/MindMapList';
import type { MindMap } from './services/mindmap';

const { Header, Content } = Layout;

const useStyles = createStyles(({ token }) => ({
  header: {
    background: token.colorBgContainer,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  content: {
    padding: '24px',
    background: token.colorBgLayout,
    minHeight: 'calc(100vh - 64px)',
  },
  mindMapContainer: {
    width: '100%',
    height: 'calc(100vh - 112px)',
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  },
}));

const defaultData: MindElixirData = {
  nodeData: {
    id: 'root',
    topic: '思维导图',
    children: [],
  },
  direction: 0,
};

const App: React.FC = () => {
  const { styles } = useStyles();
  const mindMapRef = useRef<HTMLDivElement>(null);
  const [mindMap, setMindMap] = useState<MindElixirInstance | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [listDrawerOpen, setListDrawerOpen] = useState(false);

  useEffect(() => {
    if (mindMapRef.current && !mindMap) {
      const options = {
        el: mindMapRef.current,
        direction: MindElixir.LEFT,
        data: defaultData,
        draggable: true,
        contextMenu: true,
        toolBar: true,
        nodeMenu: true,
      };

      const instance = new MindElixir(options);
      instance.init(defaultData);
      setMindMap(instance);
    }
  }, [mindMap]);

  const handleNew = () => {
    if (mindMap) {
      mindMap.init(defaultData);
      messageApi.success('已创建新的思维导图');
    }
  };

  const handleSave = async () => {
    if (mindMap) {
      try {
        const data = mindMap.getData();
        await createMindMap({
          data,
          title: data.nodeData.topic,
        });
        messageApi.success('思维导图保存成功');
      } catch (error) {
        console.error('保存思维导图时出错:', error);
        messageApi.error('保存失败，请稍后重试');
      }
    }
  };

  const handleSelect = (selectedMap: MindMap) => {
    if (mindMap) {
      mindMap.init(selectedMap.data);
      messageApi.success(`已加载思维导图: ${selectedMap.title}`);
    }
  };

  return (
    <Layout>
      {contextHolder}
      <Header className={styles.header}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
            新建
          </Button>
          <Button icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
          <Button
            icon={<FolderOpenOutlined />}
            onClick={() => setListDrawerOpen(true)}
          >
            打开
          </Button>
        </Space>
      </Header>
      <Content className={styles.content}>
        <div ref={mindMapRef} className={styles.mindMapContainer} />
      </Content>
      <MindMapList
        open={listDrawerOpen}
        onClose={() => setListDrawerOpen(false)}
        onSelect={handleSelect}
      />
    </Layout>
  );
};

export default App;
