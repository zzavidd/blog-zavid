export async function request(url: string, options: RequestInit) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res;
}
