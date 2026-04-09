"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

// export default function EventLayout({ children }) {
//     return (
//         <ProtectedRoute roles={["owner", "admin", "manager", "volunteer"]}>
//             {children}
//         </ProtectedRoute>
//     );
// }

export default function EventLayout({ children }) {
  return <div className="h-full">{children}</div>;
}
