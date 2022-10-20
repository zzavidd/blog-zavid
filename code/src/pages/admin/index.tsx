// import classnames from 'classnames';
// import type { GetStaticProps } from 'next';
// import type { RootStateOrAny } from 'react-redux';
// import { useSelector } from 'react-redux';

// import { Container } from 'components/layout';
// import { VanillaLink } from 'components/text';
// import { SITE_TITLE } from 'constants/settings';
// import type { NextPageWithLayout, PathDefinition } from 'constants/types';
// import AdminGateway from 'fragments/AdminGateway';
// import Layout from 'fragments/Layout';
// import PageMetadata from 'fragments/PageMetadata';
// import css from 'styles/pages/Admin.module.scss';

// const links = [
//   { name: 'Posts', url: 'posts' },
//   { name: 'Diary', url: 'diary' },
//   { name: 'Pages', url: 'pages' },
//   { name: 'Subscribers', url: 'subscribers' },
// ];

// // eslint-disable-next-line react/function-component-definition
// const AdminConsole: NextPageWithLayout<AdminConsoleProps> = ({
//   pathDefinition,
// }) => {
//   const theme = useSelector(({ theme }: RootStateOrAny) => theme);
//   return (
//     <AdminGateway>
//       <PageMetadata {...pathDefinition} />
//       <Container>
//         <div className={css['admin-page']}>
//           {links.map(({ name, url }, key) => {
//             const classes = classnames(
//               css['admin-block'],
//               css[`admin-block-${theme}`],
//               css[`admin-block-${url}`],
//             );
//             return (
//               <VanillaLink href={`/admin/${url}`} key={key} className={classes}>
//                 {name}
//               </VanillaLink>
//             );
//           })}
//         </div>
//       </Container>
//     </AdminGateway>
//   );
// };

// export const getStaticProps: GetStaticProps<AdminConsoleProps> = () => {
//   return {
//     props: {
//       pathDefinition: {
//         title: `Admin Console | ${SITE_TITLE}`,
//       },
//     },
//   };
// };

// AdminConsole.getLayout = Layout.addHeaderOnly;
// export default AdminConsole;

// interface AdminConsoleProps {
//   pathDefinition: PathDefinition;
// }
