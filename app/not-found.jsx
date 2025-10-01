"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Icon404 from "@/assets/svg/404";
import { Button } from "@/components/ui/button";


const Error404 = () => {
  const [animationData, setAnimationData] = useState(null);
  const [loadingAnimation, setLoadingAnimation] = useState(true);

  return (
    <section
      className="relative flex flex-col items-center justify-center h-dvh"
      role="main"
    >
      <motion.div
        className="max-w-md w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Icon404 />

        <h1 className="text-4xl font-extrabold mb-4 text-center text-primary">
          Oops! Page Not Found
        </h1>
        <p className="text-center mb-6 text-muted-foreground max-w-xs">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button asChild size={'lg'}>
            <Link
              href="/"
              className=""
              tabIndex={0}
            >
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size={'lg'}>
            <Link
              href="/contact"
              className=""
              tabIndex={0}
            >
              Contact Support
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Error404;
