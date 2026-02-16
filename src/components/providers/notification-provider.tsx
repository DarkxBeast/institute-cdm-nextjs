"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Notification types
export type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
}

interface NotificationContextType {
    showNotification: (type: NotificationType, message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Auto-dismiss duration in milliseconds
const AUTO_DISMISS_DURATION = 6000;

// Hook to use notifications
export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}

// Color variants for different notification types
const notificationStyles: Record<NotificationType, { bg: string; border: string; icon: React.ReactNode; iconColor: string }> = {
    success: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: <CheckCircle2 className="h-5 w-5" />,
        iconColor: "text-green-600",
    },
    error: {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: <AlertCircle className="h-5 w-5" />,
        iconColor: "text-red-600",
    },
    warning: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: <AlertTriangle className="h-5 w-5" />,
        iconColor: "text-orange-600",
    },
    info: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: <Info className="h-5 w-5" />,
        iconColor: "text-blue-600",
    },
};

// Single notification component
function NotificationItem({
    notification,
    onDismiss,
}: {
    notification: Notification;
    onDismiss: (id: string) => void;
}) {
    const styles = notificationStyles[notification.type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(notification.id);
        }, AUTO_DISMISS_DURATION);

        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    return (
        <div
            role="alert"
            className={cn(
                styles.bg,
                styles.border,
                "relative w-full rounded-lg border px-4 py-3 shadow-lg",
                "flex items-start gap-3",
                "animate-in slide-in-from-right-full fade-in duration-300"
            )}
        >
            <div className={cn("flex-shrink-0 mt-0.5", styles.iconColor)}>
                {styles.icon}
            </div>
            <div className="flex-1 min-w-0 pr-6">
                {notification.title && (
                    <div className="font-medium text-sm">{notification.title}</div>
                )}
                <div className="text-sm text-gray-700">
                    {notification.message}
                </div>
            </div>
            <button
                onClick={() => onDismiss(notification.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Close notification"
            >
                <X className="h-4 w-4 text-gray-500" />
            </button>
        </div>
    );
}

// Provider component
const MAX_VISIBLE_NOTIFICATIONS = 4;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback(
        (type: NotificationType, message: string, title?: string) => {
            const id = crypto.randomUUID();
            setNotifications((prev) => {
                const updated = [...prev, { id, type, message, title }];
                // Keep only the most recent notifications if we exceed the max
                // Older ones will be auto-dismissed, newest at the bottom
                return updated;
            });
        },
        []
    );

    const dismissNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    // Only show the last MAX_VISIBLE_NOTIFICATIONS
    const visibleNotifications = notifications.slice(-MAX_VISIBLE_NOTIFICATIONS);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {/* Notification container - fixed to bottom-right */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {visibleNotifications.map((notification) => (
                    <div key={notification.id} className="pointer-events-auto">
                        <NotificationItem
                            notification={notification}
                            onDismiss={dismissNotification}
                        />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}
