import { PostStatus } from '@prisma/client';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import PostsForm from 'fragments/Pages/Posts/PostForm';
import {
  InitialPostFormState,
  PostFormContext,
} from 'fragments/Pages/Posts/PostForm.context';
import { trpc } from 'utils/trpc';

const PostAdd: NextPageWithLayout = () => {
  const [state, setState] = useState(InitialPostFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: createPost, isLoading: isCreateLoading } =
    trpc.post.create.useMutation({
      onSuccess: (post) => {
        void trpcContext.post.findMany.refetch();
        const verb =
          post.status === PostStatus.PUBLISHED ? 'published' : 'drafted';
        enqueueSnackbar(`Successfully ${verb} '${post.title}'.`, {
          variant: 'success',
        });
        void router.push('/admin/posts');
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onSubmit(isPublish: boolean) {
    createPost({
      post: { data: { ...state.post, typeId: Number(state.post.typeId) } },
      isPublish,
    });
  }

  return (
    <AdminGateway>
      <PostFormContext.Provider value={[state, setState]}>
        <PostsForm
          onSubmit={onSubmit}
          submitText={'Submit'}
          heading={'Add New Post'}
          isActionLoading={isCreateLoading}
        />
      </PostFormContext.Provider>
    </AdminGateway>
  );
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: 'Add New Post',
      },
    },
  };
};

PostAdd.getLayout = Layout.addPartials;
export default PostAdd;
