'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Login from './auth/Login';
import ForgotPassword from './auth/ForgotPassword';
import { toast } from 'sonner';
import api from '../lib/api';
import Link from 'next/link';
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';
import Carousel from './auth/Carousel';
import { Separator } from './ui/separator';

export default function Auth() {
  const [view, setView] = useState('login');
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState(null);

  const handleViewChange = (newView) => {
    setView(newView);
    setError(null); // Clear any existing errors when switching views
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get("/util/resources", {
          params: {
            type: 'carousel',
            page: 1,
            limit: 3,
            sort: '-createdAt'
          }
        });

        if (response.data?.resources) {
          setCarouselImages(response.data.resources);
        } else {
          // Fallback to empty array if no resources
          setCarouselImages([]);
        }
      } catch (error) {
        console.error('Failed to fetch carousel images:', error);
        setError('Failed to load carousel images');
        setCarouselImages([]); // Set empty array on error

        // Only show toast for non-network errors
        if (error.response?.status !== 404) {
          toast.error("Failed to fetch carousel images");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Page content configuration
  const getPageContent = () => {
    const contentMap = {
      login: {
        title: 'Welcome back!',
        subtitle: 'Sign in to your account to continue',
        showBackButton: true
      },
      forgot: {
        title: 'Reset Password',
        subtitle: "We'll send you a link to reset your password",
        showBackButton: true
      }
    };

    return contentMap[view] || contentMap.login;
  };

  const pageContent = getPageContent();

  // Render form based on current view
  const renderForm = () => {
    switch (view) {
      case 'login':
        return (
          <Login
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            onViewChange={handleViewChange}
          />
        );
      case 'forgot':
        return (
          <ForgotPassword
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            onViewChange={handleViewChange}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Invalid view</p>
            <Button
              variant="outline"
              onClick={() => handleViewChange('login')}
              className="mt-4"
            >
              Go to Login
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4 py-6">
      <div className="w-full max-w-5xl mx-auto h-auto md:h-[600px] flex flex-col md:flex-row rounded-2xl shadow-xl overflow-hidden border">

        {/* Carousel Section */}
        <div className="w-full md:w-1/2 relative">
          {isLoading ? (
            <div className="w-full h-full bg-muted animate-pulse" />
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center p-8">
                <IconLoader2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Unable to load images</p>
              </div>
            </div>
          ) : (
            <Carousel images={carouselImages} />
          )}
        </div>

        {/* Form Section */}
        <Card className="w-full md:w-1/2 flex flex-col justify-between rounded-none border-none shadow-none">

          {/* Header with back button */}
          <div className="flex flex-col space-y-6">
            {pageContent.showBackButton && (
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-navy transition-colors group w-fit"
              >
                <IconArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to website
              </Link>
            )}

            {/* Title and Form */}
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="text-center space-y-3 px-0">
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {pageContent.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm md:text-base">
                  {pageContent.subtitle}
                </p>
              </CardHeader>

              <CardContent className="px-0 space-y-6">
                {renderForm()}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <Separator />
          <div className="">
            <p className="text-center text-xs text-muted-foreground">
              Protected by industry-standard security measures
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
