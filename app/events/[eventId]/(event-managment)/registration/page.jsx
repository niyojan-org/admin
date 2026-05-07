"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SpinnerCustom } from "@/components/ui/spinner";
import ErrorCard from "@/components/Card/Error";
import RegistrationBanner from "./components/RegistrationBanner";
import RegistrationForm from "./components/RegistrationForm";
import useEventRegistrationStore from "@/store/eventRegistration";
import RegistrationSuccess from "./components/Success";

export default function RegistrationPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketIdFromUrl = searchParams.get("ticket") || null;

  // const { fetchRegistrationForm, registrationForm, error, loadingRegistrationForm } =
  //   useEventStore();

  const {
    fetchRegistrationForm,
    registrationForm,
    error,
    regFormLoading,
    successData,
    selectTicket,
  } = useEventRegistrationStore();

  useEffect(() => {
    if (eventId) fetchRegistrationForm(eventId);
  }, [eventId]);

  useEffect(() => {
    if (registrationForm?.tickets && ticketIdFromUrl) {
      selectTicket(ticketIdFromUrl);
    }
  }, [registrationForm, ticketIdFromUrl]);

  useEffect(() => {
    // Clean up URL parameters after they've been processed
    if (ticketIdFromUrl || searchParams.get("coupon")) {
      const params = new URLSearchParams(searchParams.toString());
      let shouldUpdate = false;

      if (ticketIdFromUrl && registrationForm?.tickets) {
        params.delete("ticket");
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        const newUrl = params.toString()
          ? `${window.location.pathname}?${params.toString()}`
          : window.location.pathname;
        router.replace(newUrl, { shallow: true });
      }
    }
  }, [registrationForm, ticketIdFromUrl, searchParams]);


  if (regFormLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <SpinnerCustom className="text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorCard
          error={error}
          onRetry={() => window.location.reload()}
          onBrowseEvents={() => router.push("/events")}
          onGoHome={() => router.push("/")}
          className="w-full max-w-5xl mx-auto"
        />
      </div>
    );
  }

  if (successData) {
    return <RegistrationSuccess data={successData} />;
  }

  if (registrationForm) {
    return (
      <div className="pb-6">
        <RegistrationBanner
          bannerImage={
            registrationForm?.eventDetails?.bannerImage || "/banner/default-event-banner.png"
          }
          title={registrationForm?.eventDetails?.title}
          onBack={() => router.back()}
        />
        <RegistrationForm
          registrationForm={registrationForm}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <ErrorCard
        error={error}
        onRetry={() => window.location.reload()}
        onBrowseEvents={() => router.push("/events")}
        onGoHome={() => router.push("/")}
        className="w-full max-w-5xl mx-auto"
      />
    </div>
  );
}
