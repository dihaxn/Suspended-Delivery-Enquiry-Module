export const AddAllItemOption = (itemList: any[]) => {
    const allItemOption = { value: 'all', label: 'All' };
    const items = [...itemList];
    items.unshift(allItemOption);
    return items;
  };