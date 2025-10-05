"use client";
import React from "react";
import { InputFieldManager } from "../../[eventId]/components/input-fields";

export default function CustomFieldsStep({ event, setEvent }) {



  return (
    <InputFieldManager className={'flex-1'} eventId={event?._id} />
  );
}
