import { IncidentFormValue } from '@cookers/models';
import { configStore, RootState } from '@cookers/store';
import { FormButton, ModuleBaseLayout, SectionBaseLayout } from '@cookers/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { AddNewIncidentForm } from '../components/add-new-incident/add-new-incident';
import { incidentSchema } from '../components/add-new-incident/add-new-incident-validation';
import { AccidentEventSubDetails } from '../components/add-new-incident/sections/add-incident-acc-details';
import { IncidentEmployeeDetails } from '../components/add-new-incident/sections/add-incident-emp';
import { IncidentEventDetails } from '../components/add-new-incident/sections/add-incident-event';
import { IncidentEventSubDetails } from '../components/add-new-incident/sections/add-incident-inc-details';
import { InjuryDetails } from '../components/add-new-incident/sections/add-incident-injury';
/* const radioYesNoItems = [
  { value: '1', label: 'Yes' },
  { value: '2', label: 'No' },
];
const radioNormalOvertime = [
  { value: '1', label: 'Normal Hours' },
  { value: '2', label: 'Overtime' },
]; */
export function IncidentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const isNewEntry = !id;
  console.log(isNewEntry);
  const { selectedIncident, masterData } = useSelector((state: RootState) => state.incidentManagement);
  const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [incidentVisibility, setIncidentVisibility] = useState(false);
  const [accidentVisibility, setAccidentVisibility] = useState(false);
  const [injuryVisibility, setInjuryVisibility] = useState(false);

  const dispatch = useDispatch();
  console.log(masterData);

  const methods = useForm<IncidentFormValue>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      empReportId: 0,
      reportType: '',
      worksite: '',
      status: '',
      gender: '',
      personalEmail: '',
      //confirmEmail: '',
      eventOnDate: new Date(new Date().setHours(0, 0, 0, 0)),
      eventLogOnDate: new Date(new Date().setHours(0, 0, 0, 0)),
      normalOvertime: '',
      anyInstruction: '',
      anyInjury: '',
      othVehicleInvolve: '',
      authInform: '',
      oilSpill: '',
      areaContain: '',
      injuryInvolve: '',
      whoInvolve: '',
      workInform: '',
      notifyHo: '',
      firstAidType: '',
    },
  });
  const { handleSubmit } = methods;
  const handleSelectChange = (value: string) => {
    setSelectedReportType(value);
    if (value == 'INCI') {
      setIncidentVisibility(true);
      setAccidentVisibility(false);
      setInjuryVisibility(false);
    } else if (value == 'ACCI') {
      setIncidentVisibility(false);
      setAccidentVisibility(true);
      setInjuryVisibility(false);
    } else if (value == 'INJU') {
      setIncidentVisibility(false);
      setAccidentVisibility(false);
      setInjuryVisibility(true);
    } else {
      setIncidentVisibility(false);
      setAccidentVisibility(false);
      setInjuryVisibility(false);
    }
  };
  const handleInjuryChange = (value: string) => {
    if (value == '2') {
      setInjuryVisibility(true);
    } else {
      setInjuryVisibility(false);
    }
  };
  const handleFormSubmit: SubmitHandler<IncidentFormValue> = (data) => {
    console.log('Form submitted with data:', data);
  };
  const handleErrors = (errors: FieldErrors<IncidentFormValue>) => {
    console.log('Form validation errors:', errors);
    // You can handle/display React Hook Form validation errors here
  };
  useEffect(() => {
    if (isNewEntry) {
      methods.reset({
        empReportId: 0,
        reportType: '',
        worksite: '',
        /* injuryDetails: {
        firstAider: '', // Nested injuryDetails fields
        
        injuryReportedTo: '',
        injuryNature: '',
      }, */
        eventLogOnDate: new Date(new Date().setHours(0, 0, 0, 0)),
        eventOnDate: new Date(new Date().setHours(0, 0, 0, 0)),
        status: masterData.statusList[0]?.value || '',
        gender: masterData.genderList[0]?.value || '',
        normalOvertime: masterData.jobTypeList[0]?.value || '',
        anyInstruction: globalMasterData.optionList[0]?.value || '',
        anyInjury: globalMasterData.optionList[0]?.value || '',
        othVehicleInvolve: globalMasterData.optionList[0]?.value || '',
        authInform: '',
        oilSpill: '',
        areaContain: '',
        injuryInvolve: '',
        whoInvolve: '',
        workInform: '',
        notifyHo: '',
      });
    }
    /*   else if (!isNewEntry && selectedIncident) {
    methods.reset({
      empReportId: selectedIncident.empReportId,
      reportType: selectedIncident.reportType,
      worksite: selectedIncident.worksite,
      status: selectedIncident.status || '',
      gender: selectedIncident.gender || '',
    }); */
    // }
  }, [isNewEntry, masterData, methods]);
  const aside = (
    <div>
      <div>{selectedIncident.name}</div>
      <div>
        <AddNewIncidentForm onValueChange={handleSelectChange} />
      </div>
      <div>
        <FormButton label="Save Incident" name="save" size="2" onClick={handleSubmit(handleFormSubmit, handleErrors)} />
      </div>
      <ul>
        <li>
          <Link to={`/${configStore.appName}/incident-management`}>List</Link>
        </li>
        <li>
          <Link to="/leeds-and-customers/new">New</Link>
          <Link to="/leeds-and-customers/new-rooban">New Rooban</Link>
        </li>
      </ul>
    </div>
  );

  const header = (
    <div>
      <div>
        <div>
          <h3>Incident No : {id}</h3>
        </div>
      </div>
      <div>
        <button>Update</button>
      </div>
    </div>
  );
  const details = (
    <div>
      <IncidentEmployeeDetails />

      <IncidentEventDetails selectedReportType={selectedReportType} onValueChange={handleInjuryChange} />

      <div style={{ display: incidentVisibility ? 'block' : 'none' }}>
        <IncidentEventSubDetails />
      </div>
      <div style={{ display: accidentVisibility ? 'block' : 'none' }}>
        <AccidentEventSubDetails />
      </div>
      <div style={{ display: injuryVisibility ? 'block' : 'none' }}>
        <InjuryDetails selectedReportType={selectedReportType} />
      </div>
      {/* not working{accidentVisibility  && (<AccidentEventSubDetails isNewEntry={isNewEntry}/>)}  not working*/}
    </div>
  );
  const main = <SectionBaseLayout header={header} main={details}></SectionBaseLayout>;

  return (
    <FormProvider {...methods}>
      <>incident-deatial.page</>
      <form onSubmit={methods.handleSubmit(handleFormSubmit, handleErrors)}>
        <ModuleBaseLayout aside={aside} main={main} />
      </form>
    </FormProvider>
  );
}
