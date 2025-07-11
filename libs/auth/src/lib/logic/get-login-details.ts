import { User } from "@cookers/models";
import { getAxiosInstance } from "@cookers/services";

export const getLoginDetails = async (username: string) => {
  const URL = `users`;
  let responseData = {} as User;
  await getAxiosInstance().get<User>(URL).then(function (response) {
    responseData = response.data;
  });
  return {
    userData: responseData
  };
};


