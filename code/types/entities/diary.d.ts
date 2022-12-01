interface DiaryDAO {
  id?: number;
  title: string;
  content: string;
  footnote: string;
  date: string | Date;
  status: DiaryStatus;
  entryNumber: number;
  isFavourite: boolean;
  tags: string | string[];
  slug?: string;
}

type DiaryStatus = 'PROTECTED' | 'PRIVATE' | 'PUBLISHED';

interface GetAllDiaryOptions {
  sort?: QuerySort<DiaryDAO>;
  status?: DiaryStatusFilters;
  onlyFavourites?: boolean;
}

interface CreateDiaryEntryPayload {
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}

interface UpdateDiaryEntryPayload {
  id: number;
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}

interface DeleteDiaryEntryPayload {
  id: number;
}

interface DiaryStatusFilters {
  include?: IDiaryStatus[];
  exclude?: IDiaryStatus[];
}
