declare module 'react-twitter-embed' {
  export class TwitterTweetEmbedProps {
    tweetId: number;
  }
  export class TwitterTweetEmbed extends React.PureComponent<
    TwitterTweetEmbedProps,
    any
  > {}
}
