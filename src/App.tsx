import React, { useEffect, useRef, useState } from 'react';
import { Button, Layout, Space, message } from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  FolderOpenOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import MindElixir from 'mind-elixir';
import type { MindElixirData, MindElixirInstance } from 'mind-elixir';
import { createStyles } from 'antd-style';
import { createMindMap, updateMindMap } from './services/mindmap';
import MindMapList from './components/MindMapList';
import type { MindMap } from './services/mindmap';
import { logApiError, logUserAction } from './config/logger';

const { Header, Content } = Layout;

const useStyles = createStyles(({ token }) => ({
  header: {
    background: token.colorBgContainer,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  currentFile: {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    marginRight: token.marginLG,
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
  const [currentMindMap, setCurrentMindMap] = useState<MindMap | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveAsLoading, setSaveAsLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);

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
      setNewLoading(true);
      try {
        mindMap.init(defaultData);
        setCurrentMindMap(null); // 清除当前思维导图状态
        logUserAction('创建新思维导图');
        messageApi.success('已创建新的思维导图');
      } finally {
        setNewLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (mindMap) {
      setSaveLoading(true);
      try {
        const data = mindMap.getData();

        if (currentMindMap) {
          // 更新现有思维导图
          await updateMindMap(currentMindMap.id, {
            data,
            title: data.nodeData.topic,
          });
          logUserAction('更新思维导图', {
            title: data.nodeData.topic,
            id: currentMindMap.id,
          });
          messageApi.success('思维导图更新成功');
        } else {
          // 创建新思维导图
          const result = await createMindMap({
            data,
            title: data.nodeData.topic,
          });
          logUserAction('创建思维导图', {
            title: data.nodeData.topic,
            id: result.id,
          });
          messageApi.success('思维导图保存成功');
          // 保存成功后，设置为当前思维导图
          setCurrentMindMap({
            id: result.id,
            title: data.nodeData.topic,
            data: data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        logApiError('保存思维导图', error);
        messageApi.error('保存失败，请稍后重试');
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const handleSaveAs = async () => {
    if (mindMap) {
      setSaveAsLoading(true);
      try {
        const data = mindMap.getData();
        const result = await createMindMap({
          data,
          title: data.nodeData.topic,
        });
        logUserAction('保存为新思维导图', {
          title: data.nodeData.topic,
          id: result.id,
        });
        messageApi.success('思维导图保存成功');
      } catch (error) {
        logApiError('保存为新思维导图', error);
        messageApi.error('保存失败，请稍后重试');
      } finally {
        setSaveAsLoading(false);
      }
    }
  };

  const handleSelect = (selectedMap: MindMap) => {
    if (mindMap) {
      mindMap.init(selectedMap.data);
      setCurrentMindMap(selectedMap); // 设置当前思维导图
      logUserAction('加载思维导图', {
        title: selectedMap.title,
        id: selectedMap.id,
      });
      messageApi.success(`已加载思维导图: ${selectedMap.title}`);
    }
  };

  return (
    <Layout>
      {contextHolder}
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleNew}
              loading={newLoading}
              disabled={!mindMap}
            >
              新建
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              type="default"
              loading={saveLoading}
              disabled={!mindMap}
            >
              保存
            </Button>
            {currentMindMap && (
              <Button
                icon={<CopyOutlined />}
                onClick={handleSaveAs}
                loading={saveAsLoading}
                disabled={!mindMap}
              >
                保存为新数据
              </Button>
            )}
            <Button
              icon={<FolderOpenOutlined />}
              onClick={() => setListDrawerOpen(true)}
            >
              打开
            </Button>
          </Space>
        </div>
        <div className={styles.headerRight}>
          {currentMindMap && (
            <div className={styles.currentFile}>
              当前编辑: {currentMindMap.title}
            </div>
          )}
        </div>
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
