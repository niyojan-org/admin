"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { IconMail, IconMapPin2, IconMessageCircle2, IconPhoneCall } from "@tabler/icons-react";
import Link from "next/link";

const contactMethods = [
  {
    icon: IconMail,
    title: "Email",
    description: "Our friendly team is here to help.",
    value: "support@orgatick.in",
    href: "mailto:support@orgatick.in",
    type: "link"
  },
  {
    icon: IconMessageCircle2,
    title: "Live chat",
    description: "Our friendly team is here to help.",
    value: "Open Chat",
    type: "dialog"
  },
  {
    icon: IconMapPin2,
    title: "Office",
    description: "Come say hello at our up.",
    value: "Lovely Professional University\nPhagwara, Punjab, India",
    href: "https://map.google.com",
    type: "link"
  },
  {
    icon: IconPhoneCall,
    title: "Phone",
    description: "Mon-Fri from 8am to 5pm.",
    value: "+91 6206418701",
    href: "tel:+91 6206418701",
    type: "link"
  }
];

export const ContactMethods = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-8 h-fit ">
      {contactMethods.map((method, index) => {
        const Icon = method.icon;

        return (
          <div key={index} className="sm:space-y-1">
            <div className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-xl mt-3">{method.title}</h3>
            <p className="text-muted-foreground">{method.description}</p>

            {method.type === "link" && (
              <Link
                className="font-medium text-primary hover:underline inline-block "
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {method.value.split('\n').map((line, i) => (
                  <span key={i} className="truncate line-clamp-1">
                    {line}
                  </span>
                ))}
              </Link>
            )}

            {method.type === "dialog" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <p className="font-medium text-primary cursor-pointer hover:underline">
                    {method.value}
                  </p>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sorry this feature is not available</AlertDialogTitle>
                    <AlertDialogDescription>
                      Live chat feature is not available right now. We are working on it. Please try again later or contact us via email.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      })}
    </div>
  );
};
