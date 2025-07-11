import * as Tabs from "@radix-ui/react-tabs";
import { memo, ReactNode, useState } from "react";
import styles from '../controls-styles/tabs.module.css';
import { Box, Flex, Section } from '@radix-ui/themes';
import { FormButton,  } from '@cookers/ui';
import { useFormContext } from 'react-hook-form';
import { updateMultipleTabsVisibility } from '@cookers/store';
import{TabStateProps} from '@cookers/models'

interface TabsComponentProps {
  tabs: TabStateProps[];
  defaultValue?: string;
  onSubmit?: () => void;
}

const getCurrentIndex = (currentTab: string, tabs: TabStateProps[]): number => {
  return tabs.findIndex((tab) => tab.value === currentTab);
};

const isLastTab = (currentTab: string, tabs: TabStateProps[]): boolean => {
  const currentIndex = getCurrentIndex(currentTab, tabs);
  return currentIndex === tabs.length - 1;
};

export const TabsComponent = memo(({ tabs, defaultValue, onSubmit }: TabsComponentProps) => {
  
  const [currentTab, setCurrentTab] = useState(defaultValue || tabs[0].value);
  const methods = useFormContext();

  const handleNextOrSubmitClick = async () => {
    const currentIndex = getCurrentIndex(currentTab, tabs);
    const isValid = await methods.trigger(); // Trigger validation for the next button click
    if (isValid) {
        if (isLastTab(currentTab, tabs)) {// Trigger form submission if on the last tab
          if (onSubmit) {onSubmit();}
        } 
        else {// Navigate to the next tab
          setCurrentTab(tabs[currentIndex + 1].value);
        }
      } else {
        console.log('Validation failed, stay on the current tab.');
    }
  };

  const handleBackClick = () => {
    const currentIndex = getCurrentIndex(currentTab, tabs);
    if (currentIndex > 0) {
      // Navigate to the previous tab
      setCurrentTab(tabs[currentIndex - 1].value);
    }
  };

  return (
    <Flex direction="column" gap="4" pb="2" className={styles.TabsContainer}>
      <Tabs.Root value={currentTab} onValueChange={setCurrentTab} className={styles.TabsRoot}>
        <Tabs.List className={styles.TabsList}>
          {tabs.filter((tab) => tab.visible)
          .map((tab) => (
            <Tabs.Trigger key={tab.value} value={tab.value} className={styles.TabsTrigger}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Box pt="3">
          {tabs.filter((tab) => tab.visible)
          .map((tab) => (
            <Tabs.Content key={tab.value} value={tab.value} className={styles.TabsContent}>
              {tab.content}
            </Tabs.Content>
          ))}
        </Box>
      </Tabs.Root>

      <Flex   justify="end" gap="4" >
        {getCurrentIndex(currentTab, tabs) > 0 && (
          <FormButton label='Back'name='back' type="button" size="2"
           onClick={handleBackClick}/>
        )}
        <FormButton label= {isLastTab(currentTab, tabs) ? 'Submit' : 'Next'} name="submit" size="2"
          type="button" onClick={handleNextOrSubmitClick}/>                 
      </Flex>
    </Flex>
  );
});