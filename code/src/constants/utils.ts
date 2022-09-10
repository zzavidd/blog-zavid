namespace Utils {
  export async function request(url: string, options: RequestInit = {}) {
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
