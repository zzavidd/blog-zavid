import type { ReactHook } from './types';

namespace Utils {
  export function createDispatch<T>(setState: ReactHook<T>) {
    return (state: Partial<T>) => {
      setState((current) => ({ ...current, ...state }));
    };
  }

  export async function request<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (res.status.toString().startsWith('4')) {
      const { message } = await res.json();
      throw new Error(message);
    } else if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }
}

export default Utils;
