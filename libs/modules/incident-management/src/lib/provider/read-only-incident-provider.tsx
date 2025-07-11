import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RootState } from '@cookers/store';
import { useSelector } from 'react-redux';
// Define the context value shape
interface ReadOnlyIncidentContextType {
  isReadOnly: boolean;
  injuryReadOnly: boolean;
  employeeReadOnly: boolean;
 eventReadOnly: boolean;
 ownRecordReadOnly:boolean;
  docReadOnly:boolean;
 workcoverReadOnly:boolean;
  actionReadOnly: boolean;
  saveBtnVisible:boolean;
  approvalBtnVisible:boolean;
 confirmByEmpBtnVisible:boolean;
 confirmByMgrBtnVisible:boolean;
 workcoverBtnVisible:boolean;
 isReadOnlyAccess:boolean;
 isLoggedinUser:boolean;
 isDisableEmpName:boolean;
}

// Create context with default value of `undefined`
const ReadOnlyIncidentContext = createContext<ReadOnlyIncidentContextType | undefined>(undefined);

// Custom hook to use the context
export const useIncidentReadOnly = (): ReadOnlyIncidentContextType => {
  
  const context = useContext(ReadOnlyIncidentContext);
  if (!context) {
    throw new Error('useIncidentReadOnly must be used within a ReadOnlyProvider');
  }
  return context;
};

// Define configuration and props types
interface IncidentReadOnlyConfig {
  initialStatus?: string;
  editOnlyFirstTwoSection: boolean;
  isReadOnlyUser:boolean;
  editFourthSection:boolean,
  editWorkCover:boolean,
  showWorkCover:boolean
  isOrginator:boolean,
}

interface IncidentReadOnlyProps {
  children: ReactNode;
  props: IncidentReadOnlyConfig;
}

// The provider component
export const ReadOnlyProvider: React.FC<IncidentReadOnlyProps> = ({ children, props }) => {
  const {isproxyReadOnly,isNewIncident} = useSelector((state: RootState) => state.incidentManagement);
  const { initialStatus = 'O', editOnlyFirstTwoSection = false,isReadOnlyUser=false,editFourthSection=false,editWorkCover=false,showWorkCover=false } = props; // Destructure with defaults

  // Single state object for managing readonly flags
  const [readOnlyStates, setReadOnlyStates] = useState({
    isReadOnly: false,
    injuryReadOnly: false,
    actionReadOnly: false,
    ownRecordReadOnly: false,
    employeeReadOnly:false,
    eventReadOnly:false,
    docReadOnly:false,
    saveBtnVisible:false,
    approvalBtnVisible:false,
 confirmByEmpBtnVisible:false,
 confirmByMgrBtnVisible:false,
 workcoverReadOnly:false,
 workcoverBtnVisible:false,
 isReadOnlyAccess: false,
 isLoggedinUser:false,
 isDisableEmpName:false
  });
console.log("isproxyReadOnly",isproxyReadOnly)
  useEffect(() => {
    let isClosed = false;
    let actionSectionReadOnly = false;
    if(editOnlyFirstTwoSection){
      isClosed=(initialStatus === 'M'|| initialStatus === 'C'|| initialStatus === 'E')
    }
    else{
      isClosed=(initialStatus === 'M'|| initialStatus === 'C')//need to check with Quinn
    }
    if(editOnlyFirstTwoSection){
      actionSectionReadOnly=true
    }
    else{
      if(!isproxyReadOnly){
        actionSectionReadOnly= (initialStatus === 'M'|| initialStatus === 'C');
      }
      else{
        actionSectionReadOnly=isproxyReadOnly
      }
      
    }
   
    let isvisibleSave = false;
    let isvisibleSndApproval=false;
    if(editOnlyFirstTwoSection){
      isvisibleSave=( (initialStatus === 'O') && (!editWorkCover)) 
    }
    else{
      isvisibleSave=(((initialStatus === 'E' && !isproxyReadOnly && (editFourthSection || editWorkCover))|| initialStatus === 'O') )
    }
    if(!editOnlyFirstTwoSection){
      isvisibleSndApproval=(initialStatus === 'O');
    }
  
    let isvisibleConfirmByEmp = (initialStatus === 'E');
    let isvisibleConfirmByMgr = false;
    if(editFourthSection){
      isvisibleConfirmByMgr=(initialStatus === 'M')//need to check with Quinn
    }
    
    let isworkcoverbtnVisible=false;
    
    if(editWorkCover && (initialStatus === 'M' || initialStatus === 'C')){
      isworkcoverbtnVisible=true
    }
    let isworkcoverReadOnly=true;
    if(editWorkCover  && showWorkCover){
      isworkcoverReadOnly=false
    }
    let readOnlybtn=true;
    if (isReadOnlyUser ) {
      if ( !isproxyReadOnly) {
        readOnlybtn = false;
      }
      
  }
    setReadOnlyStates({
      isReadOnly: isClosed,
      employeeReadOnly:isClosed || !isvisibleSave || !readOnlybtn,
      ownRecordReadOnly:isClosed  ||isReadOnlyUser || !isvisibleSave || !readOnlybtn,
      injuryReadOnly: isClosed || (editOnlyFirstTwoSection) || !isvisibleSave || !readOnlybtn,
      actionReadOnly: actionSectionReadOnly || !isvisibleSave || !readOnlybtn,
      eventReadOnly:isClosed || !isvisibleSave || !readOnlybtn,
      docReadOnly: isClosed || !isvisibleSave || !readOnlybtn,
      saveBtnVisible:isvisibleSave,
      approvalBtnVisible:isvisibleSndApproval && (!editWorkCover) ,
      confirmByEmpBtnVisible:isvisibleConfirmByEmp,
      confirmByMgrBtnVisible:isvisibleConfirmByMgr,
      workcoverReadOnly:isworkcoverReadOnly ,
      workcoverBtnVisible:isworkcoverbtnVisible,
      isReadOnlyAccess:readOnlybtn,
      isLoggedinUser:isproxyReadOnly,
      isDisableEmpName: !isNewIncident
    });
  }, [initialStatus, editOnlyFirstTwoSection,editFourthSection,isproxyReadOnly,editWorkCover,showWorkCover,isNewIncident]);

  return <ReadOnlyIncidentContext.Provider value={readOnlyStates}>{children}</ReadOnlyIncidentContext.Provider>;
};
