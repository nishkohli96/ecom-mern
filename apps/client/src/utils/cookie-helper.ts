export function createCookie(name: string, value: string, days: number): void {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/;';
}

export function readCookie(name: string): string | null {
  const nameEQ = name + '=';
  return (
    document.cookie
      .split(';')
      .find((row) => row.trim().startsWith(nameEQ))
      ?.split('=')[1] ?? null
  );
}

export function eraseCookie(name: string): void {
  createCookie(name, '', -1);
}
