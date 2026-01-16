'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Carousel from '../../../components/Carousel';

import { toast } from 'sonner';
import api from '../../../lib/api';
import Link from 'next/link';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgetPassword';
import TwoFactorAuth from './TwoFactorAuth';
import { useRouter } from 'next/navigation';
import GoogleAuthButton from './GoogleAuthButton';
import { SpinnerCustom } from '../../../components/ui/spinner';

export default function Auth({ view: initialView }) {
  const router = useRouter();
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [twoFactorData, setTwoFactorData] = useState(null);

  const [view, setView] = useState(initialView || 'login');
  const handleViewChange = (newView) => {
    router.replace(`/auth?view=${newView}`)
    setView(newView);
  };

  const handle2FARequired = (data) => {
    console.log(data);
    setTwoFactorData(data);
  };

  const handleBack2FA = () => {
    setTwoFactorData(null);
  };


  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/util/resources?type=carousel&page=1&limit=3&sort=-createdAt");
        setCarouselImages(response.data.resources);
      } catch (error) {
        toast.error("Failed to fetch carousel images");

      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const getTitleText = () => {
    if (view === 'login') return 'Welcome back!';
    if (view === 'signup') return 'Create an account';
    return 'Forgot your password?';
  };

  const getSubtitleText = () => {
    if (view === 'login') return 'Sign in to your account';
    if (view === 'signup') return 'Welcome aboard! Let’s get started.';
    return 'We’ll send you a link to reset your password';
  };
  if (twoFactorData) {
    return (
      <TwoFactorAuth
        requiresTOTP={twoFactorData.requiresTOTP}
        requiresPasskey={twoFactorData.requiresPasskey}
        userId={twoFactorData.userId}
        onBack={handleBack2FA}
      />
    );
  }

  return (
    <div className="flex items-center justify-center my-auto px-2 h-full bg-background w-full">

      <div className="w-full bg-card max-w-5xl mx-auto flex flex-col md:flex-row sm:h-full sm:max-h-[80vh] md:bg-card rounded-2xl md:shadow-lg overflow-hidden md:border border-border items-center justify-center">
        {isLoading ? <SpinnerCustom /> : <Carousel images={carouselImages} />}

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col text-foreground justify-start p-1 md:p-8  backdrop-blur-sm md:h-full overflow-y-hidden overflow-x-hidden">

          <Link href="/" className="text-sm mb-2 inline-block hover:underline text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </Link>

          <Card className="w-full max-w-md mx-auto bg-transparent border-none shadow-none flex flex-col flex-1 px-4 h-full pb-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground font-inter">
                {getTitleText()}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-inter">{getSubtitleText()}</p>
            </CardHeader>

            <GoogleAuthButton />

            <CardContent className="flex flex-col flex-1 justify-between w-full p-0 h-full">
              {view === 'login' &&
                <Login userEmail={userEmail} setUserEmail={setUserEmail} onViewChange={handleViewChange} on2FARequired={handle2FARequired} />}

              {view === 'signup' && <Signup onViewChange={handleViewChange} />}

              {view === 'forgot' && <ForgotPassword userEmail={userEmail} setUserEmail={setUserEmail} onViewChange={handleViewChange} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}