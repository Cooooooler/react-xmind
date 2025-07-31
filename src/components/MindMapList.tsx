import React, { useEffect, useState } from 'react';
import { Drawer, List, Input, Empty, Spin, message } from 'antd';
import { createStyles } from 'antd-style';
import { SearchOutlined } from '@ant-design/icons';
import type { MindMap } from '@/services/mindmap';
import { getMindMapList } from '@/services/mindmap';

const { Search } = Input;

const useStyles = createStyles(({ token }) => ({
  searchBar: {
    marginBottom: token.marginLG,
  },
  listItem: {
    cursor: 'pointer',
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
      console.log(response, 'response');
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
              <List.Item
                className={styles.listItem}
                onClick={() => handleSelect(item)}
              >
                <List.Item.Meta
                  title={<div className={styles.title}>{item.title}</div>}
                  description={
                    <div className={styles.time}>
                      创建时间: {new Date(item.createdAt).toLocaleString()}
                    </div>
                  }
                />
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
