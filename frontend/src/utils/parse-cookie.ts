interface CookieMap {
  [key: string]: string | number | boolean | object | null;
}

export const parseCookieString = (cookieStr: string): CookieMap => {
  const cookieMap: CookieMap = {};
  const cookies = cookieStr.split('; ');

  cookies.forEach((cookie) => {
    let equalIndex = cookie.indexOf('=');
    if (equalIndex === -1) {
      return;
    }

    const key = cookie.substring(0, equalIndex);
    let value: string | object = cookie.substring(equalIndex + 1);

    try {
      value = decodeURIComponent(value);
    } catch (e) {
      // Keep original value if decoding fails
    }

    if (
      (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) ||
      (typeof value === 'string' && value.startsWith('[') && value.endsWith(']'))
    ) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // Keep string value if parsing fails
      }
    }

    cookieMap[key] = value;
  });

  return cookieMap;
};
