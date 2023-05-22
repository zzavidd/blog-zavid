import type { GetAllSubscriberOptions } from 'pages/api/subscribers';

import type { GetAllPostOptions, GetPostPayload } from 'pages/api/posts';

import type { GetAllPageParams } from '../server/api/pages';
import PageAPI from '../server/api/pages';
import SubscriberAPI from '../server/api/subscribers';

import DiaryAPI from '../server/api/diary';
import PostAPI from './api/posts';
import SearchAPI from './api/search';

namespace SSR {
  export namespace Diary {
    export async function getAll(options: GetAllDiaryOptions): Promise<string> {
      return JSON.stringify(await DiaryAPI.getAll(options));
    }

    export async function getById(id: number) {
      return JSON.stringify(await DiaryAPI.getById(id));
    }

    export async function getByNumber(number: number) {
      return JSON.stringify(await DiaryAPI.getByNumber(number));
    }

    export async function getLatest() {
      return JSON.stringify(await DiaryAPI.getLatest());
    }
  }

  export namespace Pages {
    export async function getAll(params?: GetAllPageParams) {
      return JSON.stringify(await PageAPI.findMany(params));
    }

    export async function getById(id: number) {
      return JSON.stringify(await PageAPI.getById(id));
    }

    export async function getBySlug(slug: string, isEmbed = false) {
      return JSON.stringify(await PageAPI.getBySlug(slug, isEmbed));
    }
  }

  export namespace Posts {
    export async function getAll(options: GetAllPostOptions): Promise<string> {
      return JSON.stringify(await PostAPI.getAll(options));
    }

    export async function getSingle(payload: GetPostPayload) {
      return JSON.stringify(await PostAPI.getSingle(payload));
    }

    export async function getById(id: number) {
      return JSON.stringify(await PostAPI.getById(id));
    }
  }

  export namespace Search {
    export async function getResults(searchTerm: string, onlyDiary: boolean) {
      return JSON.stringify(await SearchAPI.getResults(searchTerm, onlyDiary));
    }
  }

  export namespace Subscribers {
    export async function getAll(options: GetAllSubscriberOptions) {
      return JSON.stringify(await SubscriberAPI.getAll(options));
    }

    export async function getById(id: number) {
      return JSON.stringify(await SubscriberAPI.find(id));
    }

    export async function getByToken(token: string) {
      return JSON.stringify(await SubscriberAPI.getByToken(token));
    }
  }
}

export default SSR;
