
'use client';
import { v4 as uuidv4 } from 'uuid';
import type { UserNotification } from './types';


// A simple utility for tracking feature usage in localStorage for the admin dashboard demo.
export const trackFeatureUsage = (featureName: string) => {
    if (typeof window === 'undefined') return;
    try {
        const engagement = localStorage.getItem('featureEngagement');
        const engagementData = engagement ? JSON.parse(engagement) : {};

        engagementData[featureName] = (engagementData[featureName] || 0) + 1;

        localStorage.setItem('featureEngagement', JSON.stringify(engagementData));
    } catch (error) {
        console.error("Could not track feature usage:", error);
    }
}

export const addNotification = (notification: Omit<UserNotification, 'id' | 'timestamp' | 'read'>) => {
    if (typeof window === 'undefined') return;
    try {
        const existing = localStorage.getItem('userNotifications');
        const notifications: UserNotification[] = existing ? JSON.parse(existing) : [];
        const newNotification: UserNotification = {
            ...notification,
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            read: false,
        };
        const updatedNotifications = [newNotification, ...notifications];
        localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
        // Dispatch a storage event to notify other components (like the header) that notifications have changed.
        window.dispatchEvent(new StorageEvent('storage', { key: 'userNotifications' }));
    } catch (error) {
        console.error("Could not add notification:", error);
    }
}
