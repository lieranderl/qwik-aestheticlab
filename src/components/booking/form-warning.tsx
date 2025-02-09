import { component$ } from "@builder.io/qwik";
import { HiExclamationTriangleOutline } from "@qwikest/icons/heroicons";
import type { Technician } from "~/types";

export interface WarningFormProps {
  name: string;
  email: string;
  phone: string;
  selectedTechnician: Technician | null;
}

export const WarningForm = component$<WarningFormProps>(
  ({ name, email, phone, selectedTechnician }) => {
    const nameValid = /^[\s\S]{2,50}$/.test(name);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneValid = /^\+?[0-9\-\s]{9,15}$/.test(phone);

    return (
      <>
        {selectedTechnician &&
          (() => {
            const missingFields = [];
            if (!name) missingFields.push("name");
            if (!email) missingFields.push("email");
            if (!phone) missingFields.push("phone number");

            return missingFields.length > 0 ? (
              <div class="alert alert-warning alert-soft">
                <HiExclamationTriangleOutline />
                <span>Please enter your {missingFields.join(", ")}</span>
              </div>
            ) : (
              !(nameValid && emailValid && phoneValid) && (
                <div class="alert alert-warning alert-soft">
                  <HiExclamationTriangleOutline />
                  <span>Please provide valid details in the form.</span>
                </div>
              )
            );
          })()}
      </>
    );
  }
);
