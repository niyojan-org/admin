import { useState, useCallback } from 'react';

export const useBulkSelection = (items = []) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const selectItem = useCallback((itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  const selectAllItems = useCallback(() => {
    if (selectedItems.length === items.length) {
      // If all items are selected, deselect all
      setSelectedItems([]);
    } else {
      // Select all items
      setSelectedItems(items.map(item => item._id));
    }
  }, [items, selectedItems.length]);

  const selectMultipleItems = useCallback((itemIds) => {
    setSelectedItems(prev => {
      const newSelection = [...prev];
      itemIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      return newSelection;
    });
  }, []);

  const deselectMultipleItems = useCallback((itemIds) => {
    setSelectedItems(prev => prev.filter(id => !itemIds.includes(id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isSelected = useCallback((itemId) => {
    return selectedItems.includes(itemId);
  }, [selectedItems]);

  const isAllSelected = useCallback(() => {
    return items.length > 0 && selectedItems.length === items.length;
  }, [items.length, selectedItems.length]);

  const isPartiallySelected = useCallback(() => {
    return selectedItems.length > 0 && selectedItems.length < items.length;
  }, [selectedItems.length, items.length]);

  const getSelectedItems = useCallback(() => {
    return items.filter(item => selectedItems.includes(item._id));
  }, [items, selectedItems]);

  const getSelectedCount = useCallback(() => {
    return selectedItems.length;
  }, [selectedItems.length]);

  const toggleSelection = useCallback((itemId) => {
    selectItem(itemId);
  }, [selectItem]);

  return {
    selectedMembers: selectedItems,
    selectMember: selectItem,
    selectAllMembers: selectAllItems,
    selectMultipleMembers: selectMultipleItems,
    deselectMultipleMembers: deselectMultipleItems,
    clearSelection,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    getSelectedMembers: getSelectedItems,
    getSelectedCount,
    toggleSelection
  };
};
