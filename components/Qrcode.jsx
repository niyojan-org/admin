"use client";
import React, { useEffect, useRef } from "react";

/**
 * Qrcode component using qr-code-styling
 * @param {Object} props
 * @param {string} props.data - The data to encode in the QR code
 * @param {number} [props.size=120] - The width and height of the QR code
 * @param {object} [props.options] - Additional qr-code-styling options
 */
export default function Qrcode({ data, size = 120, options = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function renderQR() {
      if (ref.current && typeof window !== "undefined" && data) {
        ref.current.innerHTML = "";
        const { default: QRCodeStyling } = await import("qr-code-styling");
        if (!isMounted) return;
        const qr = new QRCodeStyling({
          width: size,
          height: size,
          data,
          dotsOptions: { color: "#000", type: "rounded" },
          backgroundOptions: { color: "rgba(0,0,0,0)" },
          ...options,
        });
        qr.append(ref.current);
      }
    }
    renderQR();
    return () => {
      isMounted = false;
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [data, size, options]);

  return <div ref={ref} style={{ width: size, height: size }} />;
}
