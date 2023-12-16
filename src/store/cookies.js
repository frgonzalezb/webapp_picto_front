// Funciones auxiliares para manejar cookies

export function getCookie(name) {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }

  return null;
}


export function setCookie(name, value, options = {}, expiration) {
  options = {
    path: '/',
    sameSite: 'Lax',
    secure: false,
    ...options,
  };


  if (expiration) {
    options.expires = new Date(new Date().getTime() + expiration * 1000);
  }

  const cookieString = `${name}=${encodeURIComponent(value)}; path=/; expires=${new Date(new Date().getTime() + expiration * 1000).toUTCString()}; ${options.sameSite ? `SameSite=${options.sameSite};` : ''} ${options.secure ? 'Secure;' : ''}`;
  
  document.cookie = cookieString;
}


export function clearCookie(name) {
  setCookie(name, '', { expires: new Date(0) });
}
