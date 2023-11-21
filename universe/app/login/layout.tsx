"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-col items-center justify-center h-screen pb-64">
        <StageCounter />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// TODO: Change to icons of the corresponding stages
function StageCounter() {
  const path = usePathname();

  let currentStage = 1;
  switch (path) {
    case "/login/nfc":
      currentStage = 1;
      break;
    case "/login/worldid":
      currentStage = 2;
      break;
    case "/login/ton":
      currentStage = 3;
      break;
    default:
      currentStage = 1;
      break;
  }

  return (
    <div>
      <p>{currentStage}/3</p>
    </div>
  );
}
