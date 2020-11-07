import * as Cloudinary from 'cloudinary';
import { DocumentNode } from 'graphql';
const cloudinary = Cloudinary.v2;

import { assert, fetch, FetchResponse } from '..';
import { GenericDAO } from '../../classes/interfaces/super';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const retrieveResource = (publicId: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resources_by_ids(publicId, function (
      err: any,
      { resources }: any
    ) {
      if (err) return reject(err);
      return resolve(resources);
    });
  });
};

export const extractPublicId = (image: string): string => {
  const ex = new Error(`Could not get public ID from ${image}`);
  if (!image) throw ex;

  const regex = new RegExp(
    /^(?:v[0-9]+\/)?((?:dynamic|static|test)\/.*)(?:\.[a-z]+)$/
  );
  const match = image.match(regex);
  assert.isOk(match);
  return match![1];
};

export const getEntities = <T>(options: GetEntitiesOptions): Promise<T[]> => {
  const { query, resolver, variables = {} } = options;
  return new Promise<T[]>(async (resolve, reject) => {
    try {
      const { data } = (await fetch(query, {
        variables
      })) as FetchResponse;

      const entities = data[resolver] as T[];
      resolve(entities);
    } catch (err) {
      reject(err);
    }
  });
};

export const getSingleEntity = <T>(
  id: number,
  options: GetSingleEntityOptions
): Promise<T> => {
  const { query, resolver, expectToFail = false } = options;

  return new Promise<T>(async (resolve, reject) => {
    try {
      const { data, errors } = (await fetch(query, {
        variables: { id },
        expectToFail
      })) as FetchResponse;

      if (expectToFail) {
        assert.isOk(errors);
        return resolve();
      }

      const entity = data[resolver] as T;
      resolve(entity);
    } catch (err) {
      reject(err);
    }
  });
};

export const createEntity = <T>(
  entity: T,
  options: MutateEntityOptions
): Promise<SubmitEntityResponse> => {
  const { query, resolver, anonym } = options;
  return new Promise<SubmitEntityResponse>(async (resolve, reject) => {
    try {
      const { data } = (await fetch(query, {
        variables: { [anonym]: entity, isTest: true }
      })) as FetchResponse;

      const createdEntity = data[resolver] as SubmitEntityResponse;
      assert.property(createdEntity, 'id');
      assert.isNumber(createdEntity.id);
      resolve(createdEntity);
    } catch (err) {
      reject(err);
    }
  });
};

export const updateEntity = <T extends GenericDAO>(
  id: number,
  entity: T,
  options: MutateEntityOptions
): Promise<T> => {
  const { query, resolver, anonym } = options;
  return new Promise<T>(async (resolve, reject) => {
    try {
      const { data } = (await fetch(query, {
        variables: { id, [anonym]: entity, isTest: true }
      })) as FetchResponse;

      const updatedEntity = data[resolver] as T;
      assert.strictEqual(updatedEntity.id, id);
      resolve(updatedEntity);
    } catch (err) {
      reject(err);
    }
  });
};

export const deleteEntity = <T extends GenericDAO>(
  id: number,
  options: DeleteEntityOptions
): Promise<void> => {
  const { query, resolver, verifyDelete } = options;
  return new Promise<void>(async (resolve, reject) => {
    try {
      const { data } = (await fetch(query, {
        variables: { id }
      })) as FetchResponse;
      const deletedEntity = data[resolver] as T;
      assert.property(deletedEntity, 'id');

      verifyDelete();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

interface QueryOptions {
  query: DocumentNode;
  resolver: string;
}

interface GetEntitiesOptions extends QueryOptions {
  variables?: any;
}

interface GetSingleEntityOptions extends QueryOptions {
  expectToFail?: boolean;
}

interface MutateEntityOptions extends QueryOptions {
  anonym: string;
}

interface DeleteEntityOptions extends QueryOptions {
  verifyDelete: Function;
}

export interface SubmitEntityResponse {
  id: number;
}
