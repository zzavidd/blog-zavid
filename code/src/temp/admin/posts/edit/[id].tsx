export {};
// import type { GetServerSideProps } from 'next';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// import { URLBuilder } from 'classes/_/URLBuilder';
// import type {
//   PostContentImageMapping,
//   PostDAO,
//   PostDomain,
//   PostImage,
// } from 'classes/posts/PostDAO';
// import { PostStatic } from 'classes/posts/PostStatic';
// import Alert, { AlertType } from 'constants/alert';
// import hooks from 'constants/handlers';
// import { DOMAIN } from 'constants/settings';
// import type { NextPageWithLayout, PathDefinition } from 'constants/types';
// import Utils from 'constants/utils';
// import Validate from 'constants/validations';
// import AdminGateway from 'fragments/AdminGateway';
// import Layout from 'fragments/Layout';
// import PageMetadata from 'fragments/PageMetadata';
// import PostForm, { buildPayload } from 'fragments/posts/PostForm';
// import PostAPI from 'private/api/posts';
// import SSR from 'private/ssr';

// // eslint-disable-next-line react/function-component-definition
// const PostEdit: NextPageWithLayout<PostEditProps> = ({
//   pathDefinition,
//   pageProps,
// }) => {
//   const { post: serverPost, domains } = pageProps;
//   const router = useRouter();

//   const [clientPost, setPost] = useState<PostDAO>(serverPost);
//   const [isRequestPending, setRequestPending] = useState(false);

//   // Determine if post is being published.
//   const isPublish = PostStatic.isPublished(clientPost);

//   /** Update post on server. */
//   const updatePost = async (): Promise<void> => {
//     try {
//       Validate.post(clientPost);
//       setRequestPending(true);

//       const payload = buildPayload(clientPost, isPublish, false);
//       await Utils.request('/api/posts', {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });
//       Alert.set({
//         type: AlertType.SUCCESS,
//         message: `You've successfully updated "${clientPost.title}".`,
//       });
//       returnAfterUpdate();
//     } catch (e: any) {
//       Alert.error(e.message);
//     } finally {
//       setRequestPending(false);
//     }
//   };

//   /** Return to the admin page. */
//   function returnToPostAdmin() {
//     void router.push('/admin/posts');
//   }

//   const returnAfterUpdate = () => {
//     const url = new URLBuilder();
//     url.append(DOMAIN);

//     if (PostStatic.isPage(clientPost)) {
//       const base = PostStatic.getDirectory(clientPost.domainType!);
//       url.appendSegment(base);
//       url.appendSegment(clientPost.domainSlug!);
//       url.appendSegment(clientPost.slug!);
//     } else {
//       const base = PostStatic.getDirectory(clientPost.type!);
//       url.appendSegment(base);
//       url.appendSegment(clientPost.slug!);
//     }

//     const postUrl = url.build();

//     if (document.referrer === postUrl) {
//       location.href = postUrl;
//     } else {
//       returnToPostAdmin();
//     }
//   };

//   return (
//     <AdminGateway>
//       <PageMetadata {...pathDefinition} />
//       <PostForm
//         post={clientPost}
//         domains={domains}
//         isCreateOperation={false}
//         handlers={hooks(setPost, clientPost)}
//         confirmFunction={updatePost}
//         confirmButtonText={'Update'}
//         cancelFunction={returnToPostAdmin}
//         isRequestPending={isRequestPending}
//       />
//     </AdminGateway>
//   );
// };

// export const getServerSideProps: GetServerSideProps<PostEditProps> = async ({
//   query,
// }) => {
//   const domains = await PostAPI.getDomains();
//   const id = parseInt(query.id as string);
//   const post = JSON.parse(await SSR.Posts.getById(id));

//   const image: PostImage = {
//     source: post.image as string,
//     hasChanged: false,
//   };

//   // Transform array of images into map values.
//   const contentImages: PostContentImageMapping = {};
//   const medium = post.contentImages as string[];
//   if (medium) {
//     medium.forEach((value: string, i: number) => {
//       contentImages[`image${i}`] = {
//         source: value,
//         hasChanged: false,
//       };
//     });
//   }
//   const postWithImages = { ...post, image, contentImages };

//   return {
//     props: {
//       pathDefinition: {
//         title: 'Edit Post',
//       },
//       pageProps: {
//         post: postWithImages,
//         domains,
//       },
//     },
//   };
// };

// PostEdit.getLayout = Layout.addHeaderOnly;
// export default PostEdit;

// interface PostEditProps {
//   pathDefinition: PathDefinition;
//   pageProps: {
//     post: PostDAO;
//     domains: PostDomain[];
//   };
// }