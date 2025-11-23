// Token sync utility to communicate between web app and Chrome extension

// Type declaration for Chrome API (for TypeScript)
declare global {
    interface Window {
        chrome?: typeof chrome;
    }
}

export const syncTokenToExtension = async (token: string) => {
    try {
        // Send message to window, which content script will pick up
        window.postMessage({
            type: 'ONYX_EXTENSION_SYNC',
            payload: { action: 'setToken', token }
        }, '*');
        console.log('Token sync message sent to extension');
    } catch (error) {
        console.log('Could not sync token to extension:', error);
    }
};

export const removeTokenFromExtension = async () => {
    try {
        window.postMessage({
            type: 'ONYX_EXTENSION_SYNC',
            payload: { action: 'removeToken' }
        }, '*');
        console.log('Token removal message sent to extension');
    } catch (error) {
        console.log('Could not remove token from extension:', error);
    }
};
