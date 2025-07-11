import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import{TabStateProps} from '@cookers/models'

interface TabsControlState {
  tabs: TabStateProps[];
}

const initialState: TabsControlState = {
  tabs: [],
};

const tabsControlSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setTabs(state, action: PayloadAction<TabStateProps[]>) {
      state.tabs = action.payload;
    },
    initializeTabs(state, action: PayloadAction<TabStateProps[]>) {
      state.tabs = action.payload;
    },
    updateTabVisibility(state, action: PayloadAction<{ value: string; visible: boolean }>) {
      const { value, visible } = action.payload;
      state.tabs = state.tabs.map(tab =>
        tab.value === value ? { ...tab, visible } : tab
      );
    },
    updateMultipleTabsVisibility(state, action: PayloadAction<{ values: string[]; visible: boolean }>) {
      const { values, visible } = action.payload;
      state.tabs = state.tabs.map(tab =>
        values.includes(tab.value) ? { ...tab, visible } : tab
      );
    },  
  },
});

export const { setTabs,initializeTabs, updateTabVisibility, updateMultipleTabsVisibility} = tabsControlSlice.actions;
export default tabsControlSlice.reducer;