"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CloseIcon, WotExtensionMiniIcon } from "@/components/icons";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function ConnectModal({ isOpen, onClose, onConnect }: ConnectModalProps) {
  const t = useTranslations("playground");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6 pt-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <WotExtensionMiniIcon className="w-10 h-10 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center mb-3">
              {t("connectModal.title")}
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {t("connectModal.description")}
            </p>

            {/* Features list */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {t("connectModal.feature1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {t("connectModal.feature2")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {t("connectModal.feature3")}
                </li>
              </ul>
            </div>

            {/* Connect button */}
            <button
              onClick={onConnect}
              className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              {t("connectModal.connectButton")}
            </button>

            {/* Skip link */}
            <button
              onClick={onClose}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {t("connectModal.skipButton")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}