import { PostStatus } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import PostForm from 'fragments/Pages/Posts/PostForm';
import {
  InitialPostFormState,
  PostFormContext,
} from 'fragments/Pages/Posts/PostForm.context';
import { getDomainFromPostType } from 'utils/functions';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const PostEdit: NextPageWithLayout<PostEditProps> = ({ id, params }) => {
  const [state, setState] = useState(InitialPostFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: updatePost, isLoading: isUpdateLoading } =
    trpc.post.update.useMutation({
      onSuccess: (post) => {
        const { title, status, slug } = post;
        void trpcContext.post.findMany.refetch();
        const isPublished = status === PostStatus.PUBLISHED;
        const verb = isPublished ? 'published' : 'updated';
        enqueueSnackbar(`Successfully ${verb} '${title}'.`, {
          variant: 'success',
        });
        if (status === PostStatus.DRAFT) {
          void router.push('/admin/posts');
        } else {
          const domain = getDomainFromPostType(post);
          void router.push(`/${domain}/${slug}`);
        }
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const { data: post } = trpc.post.find.useQuery(params);

  useEffect(() => {
    if (!post) return;
    setState({ post });
  }, [post]);

  function onSubmit(isPublish: boolean) {
    updatePost({
      post: {
        data: { ...state.post, typeId: Number(state.post.typeId) },
        where: { id },
      },
      isPublish,
    });
  }

  return (
    <AdminGateway>
      <PostFormContext.Provider value={[state, setState]}>
        <PostForm
          onSubmit={onSubmit}
          submitText={'Update'}
          heading={'Edit Post'}
          isActionLoading={isUpdateLoading}
        />
      </PostFormContext.Provider>
    </AdminGateway>
  );
};

export const getServerSideProps: GetServerSideProps<PostEditProps> = async (
  ctx,
) => {
  const { query } = ctx;
  const id = Number(query.id);
  const params: PostFindInput = { params: { where: { id } } };

  const helpers = getServerSideHelpers(ctx);
  await helpers.post.find.prefetch(params);

  return {
    props: {
      id,
      params,
      pathDefinition: { title: 'Edit Post' },
      trpcState: helpers.dehydrate(),
    },
  };
};

PostEdit.getLayout = Layout.addPartials;
export default PostEdit;

interface PostEditProps extends AppPageProps {
  id: number;
  params: PostFindInput;
}
