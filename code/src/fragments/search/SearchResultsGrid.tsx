export {};
// import classnames from 'classnames';
// import React, { memo, useEffect, useState } from 'react';
// import type { RootStateOrAny } from 'react-redux';
// import { useSelector } from 'react-redux';
// import { zDate } from 'zavid-modules';

// import type { SearchResultEntityDAO } from 'classes/entity';
// import CloudImage, { AspectRatio } from 'components/image';
// import { Title, VanillaLink } from 'components/text';
// import css from 'styles/pages/Search.module.scss';

// import { MatchedContent } from './MatchedContent';

// export function ResultsGrid({ results, searchTerm }: ResultsGridProps) {
//   if (!results.length) {
//     return (
//       <div className={css['search-results-error']}>
//         {searchTerm ? 'No results found' : 'Type in a search term...'}
//       </div>
//     );
//   }
//   return (
//     <div className={css['search-results-list']}>
//       {results.map((entity, key) => (
//         <ResultEntity
//           entity={entity}
//           searchTerm={searchTerm}
//           idx={key}
//           key={key}
//         />
//       ))}
//     </div>
//   );
// }

// export const ResultEntity = memo(
//   ({ entity, searchTerm, idx }: ResultEntityProps) => {
//     const theme = useSelector(({ theme }: RootStateOrAny) => theme);
//     const [isLoaded, setLoaded] = useState(false);

//     useEffect(() => {
//       setLoaded(true);
//     }, [isLoaded]);

//     const date = zDate.formatDate(entity.date as string, {
//       withWeekday: true,
//     });

//     const classes = classnames(
//       css['search-results-entity'],
//       css[`search-results-entity--${theme}`],
//     );

//     return (
//       <VanillaLink href={entity.slug!}>
//         <div
//           className={classes}
//           style={{ animationDelay: `${idx * 75 + 50}ms` }}>
//           <div className={css['search-results-index']}>#{entity.index}</div>
//           <Title className={css['search-results-title']}>{entity.title}</Title>
//           <div className={css['search-results-metadata']}>{date}</div>
//           <MatchedContent entity={entity} searchTerm={searchTerm} />
//           <ResultEntityImage entity={entity} />
//         </div>
//       </VanillaLink>
//     );
//   },
// );

// export function ResultEntityImage({ entity }: ResultEntityImageProps) {
//   if (!entity.image) return null;
//   return (
//     <CloudImage
//       src={entity.image as string}
//       alt={entity.title}
//       aspectRatio={AspectRatio.WIDE}
//       containerClassName={css['search-results-image']}
//     />
//   );
// }

// interface ResultsGridProps {
//   results: SearchResultEntityDAO[];
//   searchTerm: string;
// }

// interface ResultEntityProps {
//   entity: SearchResultEntityDAO;
//   searchTerm: string;
//   idx: number;
// }

// interface ResultEntityImageProps {
//   entity: SearchResultEntityDAO;
// }
