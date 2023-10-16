export default function cloudinaryLoader({ src, width, quality }) {
  if (src.startsWith('https://')) return src;
  const params = [
    'f_auto',
    'c_limit',
    `w_${width}`,
    `q_${quality || 'auto'}`,
  ].join(',');
  return `https://res.cloudinary.com/zavid/image/upload/${params}/${src}`;
}
