
'use client';

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
