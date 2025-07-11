import { configStore } from '@cookers/store';

export const getApiBaseURL = () => {
  if (configStore.mockOn)
    return `${configStore.apiMockPath}/`;
  else
    return `${configStore.apiPath}/`;
}
// export const getApiBaseURL = () => {
//   if (configStore.mockOn)
//     return `${configStore.apiMockPath}/${configStore.uniqueKey}/`;
//   else
//     return `${configStore.apiPath}/${configStore.uniqueKey}/`;
// }

export const getWso2ApiBaseURL = () => {
  return `${configStore.apiWso2Path}`;
}

export const getWso2BaseToken = () => `${configStore.baseToken}`;
