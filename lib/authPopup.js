import { useUserStore } from "@/store/userStore";
export function getRootDomain() {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${hostname}${window.location.port ? ':' + window.location.port : ''}`;
  }
  const parts = hostname.split('.');
  if (parts.length <= 2) {
    return hostname;
  }
  return parts.slice(-2).join('.');
}

export function getAuthUrl(view = 'login') {
  const rootDomain = getRootDomain();
  const protocol = window.location.protocol;
  return `${protocol}//${rootDomain}/auth?popup=true&view=${view}`;
}

export function openAuthPopup(view = 'login', options = {}) {
  const {
    width = 500,
    height = 700,
  } = options;

  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
  const url = getAuthUrl(view);
  const popup = window.open(url, 'orgatick-auth-popup', features);
  if (!popup) {
    console.error('Failed to open popup. Please check popup blocker settings.');
    return null;
  }
  return popup;
}


export function listenForAuthSuccess(onSuccess, onError) {
  const handleMessage = (event) => {
    const rootDomain = getRootDomain();
    const expectedOrigin = `${window.location.protocol}//${rootDomain}`;
    if (event.origin !== expectedOrigin) {
      console.warn('Received message from unexpected origin:', event.origin, 'Expected:', expectedOrigin);
      return;
    }
  };
  window.addEventListener('message', handleMessage);
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

export function authenticateWithPopup(view = 'login', options = {}) {
  return new Promise((resolve, reject) => {
    const popup = openAuthPopup(view, options);

    if (!popup) {
      reject(new Error('Failed to open authentication popup. Please check popup blocker settings.'));
      return;
    }

    let cleanupFn = null;
    const checkClosed = setInterval(async () => {
      if (popup.closed) {
        clearInterval(checkClosed);
        if (cleanupFn) cleanupFn();
        const { fetchUser, user } = useUserStore.getState();
        await fetchUser();
        resolve(user);
      }
    }, 500);
  });
}