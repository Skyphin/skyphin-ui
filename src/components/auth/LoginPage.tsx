import { useState } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            // TODO: Replace with your actual OAuth 2.0 Client ID from Google Cloud Console
            const CLIENT_ID = '269925059572-4m212topt0echl6q0fufm7bribss1h5a.apps.googleusercontent.com';
            const REDIRECT_URI = chrome.identity.getRedirectURL();

            // Scopes must match what you configured in Google Cloud Console
            const scopes = ['openid', 'email', 'profile'];
            const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

            authUrl.searchParams.set('client_id', CLIENT_ID);
            authUrl.searchParams.set('response_type', 'id_token');
            authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
            authUrl.searchParams.set('nonce', Math.random().toString(36).substring(2)); // basic nonce
            authUrl.searchParams.set('scope', scopes.join(' '));

            const responseUrl = await chrome.identity.launchWebAuthFlow({
                url: authUrl.toString(),
                interactive: true
            });

            if (!responseUrl) {
                throw new Error('No response URL from Google Auth');
            }

            // Parse id_token from the hash fragment
            const url = new URL(responseUrl);
            const params = new URLSearchParams(url.hash.substring(1)); // remove the #
            const idToken = params.get('id_token');

            if (!idToken) {
                console.error('Response URL:', responseUrl);
                throw new Error('No ID token found in response');
            }

            // Create Firebase credential
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);

        } catch (err: any) {
            console.error('Login error:', err);
            // Handle user closing the popup specifically if possible, though 'User cancelled' is common
            if (err.message?.includes('User cancelled')) {
                setError('Login cancelled');
            } else {
                setError(err.message || 'An error occurred during sign in');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    Welcome to A9Flow
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Sign in to continue to your dashboard
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-left">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? (
                        <span>Connecting...</span>
                    ) : (
                        <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    className="text-blue-600"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    className="text-green-600"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    className="text-yellow-500"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    className="text-red-500"
                                />
                            </svg>
                            Sign in with Google
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
