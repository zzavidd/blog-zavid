namespace Utils {
  export function createDispatch<T>(setState: ReactHook<T>): LocalDispatch<T> {
    return (state: Partial<T>) => {
      setState((current) => ({ ...current, ...state }));
    };
  }

  export async function request<T = BodyInit>(
    url: string,
    options: RequestOptions<T> = {},
  ): Promise<T> {
    const body =
      typeof options.body === 'string'
        ? options.body
        : typeof options.body === 'object'
        ? (JSON.stringify(options.body) as any)
        : null;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
      body,
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }
}

export default Utils;

interface RequestOptions<T> extends Omit<RequestInit, 'body'> {
  body?: T;
}
