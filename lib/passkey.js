import api from './api';

/**
 * Converts a base64url string to ArrayBuffer
 * Required for WebAuthn API which expects ArrayBuffer format
 */
function base64urlToBuffer(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLength);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Converts ArrayBuffer to base64url string
 * Required to send credential back to server in expected format
 */
function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Passkey Login Flow using WebAuthn Conditional Mediation
 * 
 * This implements Google-style passkey login where passkeys appear in the
 * password manager dropdown when the user focuses the email input field.
 * 
 * Technical Implementation:
 * - Uses navigator.credentials.get() with mediation: 'conditional'
 * - Does NOT pass allowCredentials (required for conditional UI)
 * - Runs silently in background, doesn't block user interaction
 * - Automatically authenticates when user selects a passkey from dropdown
 * 
 * Flow:
 * 1. Request login options from server (challenge, rpId, etc.)
 * 2. Start conditional WebAuthn request (waits for user selection)
 * 3. When user selects passkey, browser provides credential
 * 4. Send credential to server for verification
 * 5. Return authentication result
 * 
 * @param {boolean} useConditionalUI - Whether to use conditional UI (autofill)
 * @param {AbortController} abortController - Optional AbortController to cancel the request
 * @returns {Promise<Object>} User data and access token
 */
export async function loginWithPasskey(useConditionalUI = false, abortController = null) {
  try {
    // Step 1: Get login options from server
    // Server returns challenge, rpId, timeout, etc.
    const optionsResponse = await api.post('/auth/passkeys/login/options');

    if (!optionsResponse.data.success) {
      throw new Error(optionsResponse.data.message || 'Failed to get login options');
    }

    // Extract options from response
    let options = optionsResponse.data.options || optionsResponse.data;
    
    if (!options || typeof options !== 'object') {
      console.error('Invalid options object:', options);
      throw new Error('Invalid options received from server');
    }

    // Step 2: Prepare publicKey options for WebAuthn API
    // Convert base64url strings to ArrayBuffer format
    const publicKeyOptions = {
      challenge: base64urlToBuffer(options.challenge),
      timeout: options.timeout || 60000,
      rpId: options.rpId,
      userVerification: options.userVerification || 'preferred',
      
      // CRITICAL: For Conditional Mediation, we must NOT include allowCredentials
      // This allows the browser to show ALL passkeys in the autofill dropdown
      // If allowCredentials is specified, conditional UI will not work
    };

    // Step 3: Start WebAuthn credential request
    // Use native navigator.credentials.get() API (NOT SimpleWebAuthn library)
    const credentialRequestOptions = {
      publicKey: publicKeyOptions,
    };

    // Add conditional mediation if requested
    // This is what makes passkeys appear in the password manager dropdown
    if (useConditionalUI) {
      credentialRequestOptions.mediation = 'conditional';
    }

    // Add abort signal if provided
    if (abortController) {
      credentialRequestOptions.signal = abortController.signal;
    }

    // Request credential from browser
    // For conditional UI: this waits silently until user selects a passkey
    // For regular flow: this shows a browser prompt immediately
    const credential = await navigator.credentials.get(credentialRequestOptions);

    if (!credential) {
      throw new Error('No credential received from authenticator');
    }

    // Step 4: Convert credential response to format expected by server
    // WebAuthn returns ArrayBuffers, but server expects base64url strings
    const credentialJSON = {
      id: credential.id,
      rawId: bufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        authenticatorData: bufferToBase64url(credential.response.authenticatorData),
        clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
        signature: bufferToBase64url(credential.response.signature),
        userHandle: credential.response.userHandle 
          ? bufferToBase64url(credential.response.userHandle)
          : null,
      },
    };

    // Step 5: Send credential to server for verification
    const verifyResponse = await api.post('/auth/passkeys/login/verify', credentialJSON);

    if (!verifyResponse.data.success) {
      throw new Error(verifyResponse.data.message || 'Login verification failed');
    }

    // Return user data and token
    return {
      success: true,
      data: verifyResponse.data.data,
      message: verifyResponse.data.message
    };

  } catch (error) {
    // Silently ignore user cancellations and aborts
    // These are normal when user doesn't select a passkey from autofill
    if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
      return {
        success: false,
        cancelled: true,
        message: 'User cancelled passkey authentication'
      };
    }
    
    // Handle specific WebAuthn errors
    if (error.name === 'InvalidStateError') {
      throw new Error('Authenticator is in an invalid state');
    } else if (error.name === 'NotSupportedError') {
      throw new Error('Passkeys are not supported on this device');
    }

    // Handle API errors
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    // Generic error
    throw error;
  }
}

/**
 * Check if WebAuthn/Passkeys are supported in the current browser
 * @returns {boolean} True if supported
 */
export function isPasskeySupported() {
  return typeof window !== 'undefined' && 
         window.PublicKeyCredential !== undefined &&
         typeof window.PublicKeyCredential === 'function';
}

/**
 * Check if platform authenticator (like Face ID, Touch ID, Windows Hello) is available
 * @returns {Promise<boolean>} True if available
 */
export async function isPlatformAuthenticatorAvailable() {
  if (!isPasskeySupported()) {
    return false;
  }

  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Error checking platform authenticator:', error);
    return false;
  }
}

/**
 * Check if conditional UI (autofill) is supported
 * @returns {Promise<boolean>} True if supported
 */
export async function isConditionalUISupported() {
  if (!isPasskeySupported()) {
    return false;
  }

  try {
    return await window.PublicKeyCredential.isConditionalMediationAvailable();
  } catch (error) {
    console.error('Error checking conditional UI support:', error);
    return false;
  }
}
