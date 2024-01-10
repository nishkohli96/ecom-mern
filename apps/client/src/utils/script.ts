/* Function to load script and append in DOM tree. */
export function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log('script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.log('error in loading script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
