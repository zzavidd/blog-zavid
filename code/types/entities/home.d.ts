interface HomePageContent {
  latestDiaryEntry: DiaryDAO;
  latestReverie;
  randomPosts;
}

interface HomePreloadProps extends Record<string, unknown> {
  homeText: string;
  emailSubCount: number;
}
