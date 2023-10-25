import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace('_dev', ''),
    },
  },
});

// const diaryEntries = await prisma.diary.findMany({
//   where: {
//     OR: [
//       { content: { contains: '/reveries/21-appreciation-day/' } },
//       { content: { contains: '/reveries/appreciation-day-part-2/' } },
//       { content: { contains: '/reveries/appreciation-day-iii/' } },
//     ],
//   },
// });
// const queries = diaryEntries.map(({ id, content }) => {
//   return prisma.diary.update({
//     data: {
//       content: content
//         .replaceAll('/reveries/21-appreciation-day/', '/tributes/')
//         .replaceAll('/reveries/appreciation-day-part-2/', '/tributes/')
//         .replaceAll('/reveries/appreciation-day-iii/', '/tributes/'),
//     },
//     where: { id },
//   });
// });

// await prisma.$transaction(queries);
const result = await prisma.wishlistCategory.findMany({
  include: {
    _count: true,
  },
});
console.info(result);
