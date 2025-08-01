import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  Input,
  Empty,
  Spin,
  message,
  Button,
  Popconfirm,
} from 'antd';
import { createStyles } from 'antd-style';
import { SearchOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { MindMap } from '@/services/mindmap';
import { getMindMapList, deleteMindMap } from '@/services/mindmap';

const { Search } = Input;

const useStyles = createStyles(({ token }) => ({
  searchBar: {
    marginBottom: token.marginLG,
  },
  listItem: {
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
  title: {
    color: token.colorText,
    fontWeight: 'bold',
    fontSize: token.fontSizeLG,
    marginBottom: token.marginXS,
  },
  time: {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
  },
  actions: {
    display: 'flex',
    gap: token.marginXS,
  },
  actionButton: {
    padding: '4px 8px',
    height: 'auto',
  },
}));

interface MindMapListProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mindMap: MindMap) => void;
}

const MindMapList: React.FC<MindMapListProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const { styles } = useStyles();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);

  const fetchMindMaps = async (title?: string) => {
    try {
      setLoading(true);
      const response = await getMindMapList({ title });
      setMindMaps(response.list);
    } catch (error) {
      console.error('获取思维导图列表出错:', error);
      message.error('获取思维导图列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMindMaps();
    }
  }, [open]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    fetchMindMaps(value);
  };

  const handleSelect = (mindMap: MindMap) => {
    onSelect(mindMap);
    onClose();
  };

  const handleDelete = async (mindMap: MindMap, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteMindMap(mindMap.id);
      message.success('删除成功');
      // 重新获取列表
      fetchMindMaps(searchValue);
    } catch (error) {
      console.error('删除思维导图时出错:', error);
      message.error('删除失败，请稍后重试');
    }
  };

  return (
    <Drawer
      title="选择思维导图"
      placement="right"
      width={400}
      open={open}
      onClose={onClose}
    >
      <Search
        className={styles.searchBar}
        placeholder="搜索思维导图"
        allowClear
        enterButton={<SearchOutlined />}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
      />
      <Spin spinning={loading}>
        {mindMaps.length > 0 ? (
          <List
            dataSource={mindMaps}
            renderItem={(item) => (
              <List.Item className={styles.listItem}>
                <List.Item.Meta
                  title={<div className={styles.title}>{item.title}</div>}
                  description={
                    <div className={styles.time}>
                      创建时间: {new Date(item.createdAt).toLocaleString()}
                    </div>
                  }
                />
                <div className={styles.actions}>
                  <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    className={styles.actionButton}
                    onClick={() => handleSelect(item)}
                  >
                    查看
                  </Button>
                  <Popconfirm
                    title="确定要删除这个思维导图吗？"
                    description="删除后将无法恢复"
                    onConfirm={(e) => handleDelete(item, e as any)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      className={styles.actionButton}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无思维导图" />
        )}
      </Spin>
    </Drawer>
  );
};

export default MindMapList;
