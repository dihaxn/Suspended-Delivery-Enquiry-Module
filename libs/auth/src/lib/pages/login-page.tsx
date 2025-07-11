import { Heading, SButton } from '@cookers/ui';
import { Login } from '../components/login';
import './login-page.css';

export const LoginPage = () => {
  // if (isAuthenticated) {
  //   navigate(-1);
  //   return null;
  // }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          {/* <a href="#" className="flex items-center gap-2 font-medium">
            <img src="./assets/cookers-logo.svg" alt="Cookers" className="w-[150px]" />
          </a> */}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Login />
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <p className="text-xs text-muted-foreground">© Copyright 2025 - All Rights Reserved</p>
          <p></p>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block bg-[#1A428A]">
        <img src="./assets/login-bg.jpg" alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );

  // return (
  //   <div className="login-container">
  //     <IntroBlock />
  //     <div className="content">
  //       <Login />
  //     </div>
  //   </div>
  // );
};

const IntroBlock = () => {
  return (
    <div className=" text-3xl">
      <div>
        <Heading className="text-9xl">
          {/* Cookers <span>CMS</span> */}
          Cookers Bulk Oil System
        </Heading>

        <SButton>Rooban</SButton>
        {/* <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod
          tempor
        </p> */}
      </div>
      <div className="hero-image">
        <img src="assets/images/img-intro.png" alt="" />
      </div>
    </div>
  );
};
