

export interface MasterFileLogFilters {
    duration: string;
    dateFrom: string;
    dateTo: string;
    originator: string;
    proxyUser: string;
    code: string;
    masterFile: string;
    columnFilters: string;
    displayName: string;
}

export const DefaultMasterFileLogFilters: MasterFileLogFilters = {
    duration: 'week',
    dateFrom: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    dateTo: new Date().toISOString(),
    originator: '',
    proxyUser: '',
    columnFilters: '',
    code: '',
    masterFile: '',
    displayName: ''
};