import type { Key, ReactNode } from 'react';

import { IconChevronDown } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { useCallback, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import styles from './collapse.module.css';

export interface CollapseProps {
  accordion?: boolean;
  defaultActiveKey?: Key;
  innerClassNames?: {
    container?: string;
  };
  items: {
    children: ReactNode;
    header: ReactNode;
    key: Key;
    noExpand?: boolean;
    innerClassNames?: {
      activeItem?: string;
      content?: string;
      header?: string;
      headerContainer?: string;
      icon?: string;
      panel?: string;
      wrapper?: string;
    };
  }[];
  onChange?: (openIndexes: Key[]) => void;
  openKeys?: Key[];
}

export default function Collapse({
  accordion,
  defaultActiveKey,
  innerClassNames,
  items,
  onChange,
  openKeys,
}: CollapseProps) {
  const [localOpenKeys, setLocalOpenKeys] = useState<Key[]>(
    openKeys ?? (defaultActiveKey ? [defaultActiveKey] : [])
  );

  useUpdateEffect(() => {
    if (openKeys) {
      setLocalOpenKeys(openKeys);
    }
  }, [openKeys]);

  const handleKeysChange = useCallback(
    (keys: Key[]) => {
      setLocalOpenKeys(keys);
      onChange?.(keys);
    },
    [onChange]
  );

  const toggleCollapse = useCallback(
    (key: Key) => {
      const close = localOpenKeys.includes(key);

      if (close) {
        handleKeysChange(localOpenKeys.filter((item) => item !== key));
        return;
      }

      if (accordion) {
        handleKeysChange([key]);
        return;
      }

      handleKeysChange([...localOpenKeys, key]);
    },
    [accordion, handleKeysChange, localOpenKeys]
  );

  return (
    <div className={clsx(styles.container, innerClassNames?.container)}>
      {items.map((item) => (
        <div
          className={clsx(
            styles.panel,
            item.innerClassNames?.panel,
            {
              [styles.activeItem]: localOpenKeys.includes(item.key),
            },
            localOpenKeys.includes(item.key) && item.innerClassNames?.activeItem
          )}
          key={item.key}
        >
          <button
            className={clsx(
              styles.wrapper,
              item.innerClassNames?.wrapper,
              item.noExpand && styles.noExpand
            )}
            onClick={() => {
              if (!item.noExpand) {
                toggleCollapse(item.key);
              }
            }}
          >
            <div className={clsx(styles.headerContainer, item.innerClassNames?.headerContainer)}>
              <div className={clsx(styles.header, item.innerClassNames?.header)}>{item.header}</div>
              <IconChevronDown className={clsx(styles.dropdownIcon, item.innerClassNames?.icon)} />
            </div>
          </button>
          {localOpenKeys.includes(item.key) && (
            <div className={clsx(styles.content, item.innerClassNames?.content)}>
              {item.children}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
