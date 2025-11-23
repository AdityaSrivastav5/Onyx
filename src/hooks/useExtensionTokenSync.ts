"use client";

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { syncTokenToExtension, removeTokenFromExtension } from '@/utils/extensionSync';

/**
 * Hook to automatically sync Clerk JWT token to Chrome extension
 * This should be used in a top-level layout component
 */
export function useExtensionTokenSync() {
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        const syncToken = async () => {
            if (isSignedIn) {
                try {
                    const token = await getToken();
                    if (token) {
                        await syncTokenToExtension(token);
                    }
                } catch (error) {
                    console.error('Failed to get token for extension sync:', error);
                }
            } else {
                // User signed out, remove token from extension
                await removeTokenFromExtension();
            }
        };

        syncToken();

        // Sync token every 5 minutes to keep it fresh
        const interval = setInterval(syncToken, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isSignedIn, getToken]);
}
