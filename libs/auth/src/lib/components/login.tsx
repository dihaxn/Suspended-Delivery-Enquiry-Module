import { ReadOnlyProvider } from '@cookers/providers';
import { setUserDetails, setWso2Token } from '@cookers/store';
import { FormButton, FormInput, Heading } from '@cookers/ui';
import { fetchIpAddress } from '@cookers/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { useAuthContext } from '../../auth-provider';
import { getLoginDetails } from '../logic/get-login-details';
import { getToken } from '../logic/get-token';
const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username must be entered' }),
  password: z.string().min(1, { message: 'Password must be entered' }),
});

type FormFields = z.infer<typeof loginSchema>;

export const Login = () => {
  const { handleLogin } = useAuthContext();
  const methods = useForm<FormFields>({
    defaultValues: {
      username: '', //kbowles
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;
  const dispatch = useDispatch();

  const handleOnSubmit = async (data: FormFields) => {
    try {
      const ipaddress = await fetchIpAddress();
      const { wso2Data } = await getToken(data.username, data.password);

      //TODO: to be removed after integrating with WSO2

      /*  const wso2Data = {
         access_token: 'ef075720-63fa-3f52-bd2f-178c5a3fe3c3',
         refresh_token: '80c944ba-794f-3670-95f9-ed92c80c0296',
         scope: 'default',
         token_type: 'Bearer',
         expires_in: 7386,
       }; */

      if (wso2Data.access_token !== '') {
        localStorage.setItem('wso2Token', JSON.stringify(wso2Data));
        localStorage.setItem('originator', JSON.stringify(data.username));
        localStorage.setItem('wso2TokenTime', JSON.stringify(Date.now()));
        const { userData } = await getLoginDetails(data.username);
        const userDatawithIP = { ...userData, ipaddress };

        if (userData.originator !== '') {
          dispatch(setWso2Token(wso2Data));
          dispatch(setUserDetails(userData));
          localStorage.setItem('user', JSON.stringify(userDatawithIP));
          const proxyUser = {
            userName: userData.originator,
            empId: userData.empId,
            name: userData.name,
            firstLetter: userData.firstLetter,
          };
          localStorage.setItem('proxyUser', JSON.stringify(proxyUser));
          handleLogin();
        } else throw new Error('Login failed');
      } else throw new Error('Login failed');
    } catch (error) {
      console.log(error);
      methods.reset();
      setError('root', {
        message: 'Incorrect Username or Password',
      });
    }
  };

  return (
    <ReadOnlyProvider readOnly={false} section="loginForm">
      {/* <pre>{JSON.stringify(methods.formState, null, 2)}</pre> */}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-2 mb-10">
          <img src="./assets/cookers-logo.svg" alt="Cookers" className="w-[200px] mx-auto mb-12" />
          <div className="flex flex-col items-center gap-2 text-center mb-6">
            <Heading size="6">Login to your account</Heading>
            <p className="text-balance text-sm text-muted-foreground">Enter your credentials to login to your account</p>
          </div>
          {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}
          <FormInput label="Username" name="username" size="l" />
          <FormInput label="Password" type="password" name="password" size="l" />
          <FormButton label="Login" name="login" type="submit" />
          {/*  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-5">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Having issues with login ?</span>
          </div> */}
          {/* <div className="text-center text-sm gap-6 flex justify-center ">
            <button type="button" className="underline underline-offset-4 text-xs">
              Reset Password
            </button>

            <span className="text-muted-foreground">|</span>

            <button type="button" className="underline underline-offset-4 text-xs">
              Request Support
            </button>
          </div> */}
        </form>
      </FormProvider>
    </ReadOnlyProvider>
  );
};
