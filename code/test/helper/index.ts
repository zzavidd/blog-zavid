import * as Cloudinary from 'cloudinary';
import { ResourceApiResponse } from 'cloudinary';
import { DocumentNode } from 'graphql';
const cloudinary = Cloudinary.v2;

import { assert, debug, fetch, FetchResponse } from '..';
import { GenericDAO } from '../../classes/interfaces/super';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getEntities<T>(
  options: GetEntitiesOptions,
): Promise<T[] | void> {
  const { query, resolver, variables = {} } = options;
  try {
    const { data } = (await fetch(query, {
      variables,
    })) as FetchResponse;

    const entities = data![resolver] as T[];
    return entities;
  } catch (err) {
    debug(err);
  }
}

export async function getSingleEntity<T>(
  id: number,
  options: GetSingleEntityOptions,
): Promise<T | void> {
  const { query, resolver, expectToFail = false } = options;
  try {
    const { data, errors } = (await fetch(query, {
      variables: { id },
      expectToFail,
    })) as FetchResponse;

    if (expectToFail) {
      assert.isOk(errors);
      return;
    }

    const entity = data![resolver] as T;
    return entity;
  } catch (err) {
    debug(err);
  }
}

export async function createEntity<T>(
  entity: T,
  options: MutateEntityOptions,
): Promise<SubmitEntityResponse | void> {
  const { query, resolver, anonym, extraVariables = {} } = options;
  try {
    const { data } = (await fetch(query, {
      variables: { [anonym]: entity, isTest: true, ...extraVariables },
    })) as FetchResponse;

    const createdEntity = data![resolver] as SubmitEntityResponse;
    assert.property(createdEntity, 'id');
    assert.isNumber(createdEntity.id);
    return createdEntity;
  } catch (err) {
    debug(err);
  }
}

export async function updateEntity<T extends GenericDAO>(
  id: number,
  entity: T,
  options: MutateEntityOptions,
): Promise<T | void> {
  const { query, resolver, anonym, extraVariables = {} } = options;
  try {
    const { data } = (await fetch(query, {
      variables: { id, [anonym]: entity, isTest: true, ...extraVariables },
    })) as FetchResponse;

    const updatedEntity = data![resolver] as T;
    assert.strictEqual(updatedEntity.id, id);
    return updatedEntity;
  } catch (err) {
    debug(err);
  }
}

export async function deleteEntity<T extends GenericDAO>(
  id: number,
  options: DeleteEntityOptions,
): Promise<void> {
  const { query, resolver, verifyDelete } = options;
  try {
    const { data } = (await fetch(query, {
      variables: { id },
    })) as FetchResponse;
    const deletedEntity = data![resolver] as T;
    assert.property(deletedEntity, 'id');

    verifyDelete();
  } catch (err) {
    debug(err);
  }
}

/**
 * Retrieves a list of resources matching a specified public ID
 * @param publicId A resource Cloudinary public ID.
 */
export function retrieveResource(
  publicId: string,
): Promise<ResourceApiResponse> {
  return new Promise((resolve) => {
    cloudinary.api.resources_by_ids(publicId, function (err, result) {
      resolve(result.resources as ResourceApiResponse);
    });
  });
}

/**
 * Extracts the public ID from a Cloudinary image URL.
 * @param image The image URL.
 */
export function extractPublicId(image: string): string {
  const ex = new Error(`Could not get public ID from ${image}`);
  if (!image) throw ex;

  const regex = new RegExp(
    /^(?:v[0-9]+\/)?((?:dynamic|static|test)\/.*)(?:\.[a-z]+)$/,
  );
  const match = image.match(regex);
  assert.isOk(match);
  return match![1];
}

interface QueryOptions {
  query: DocumentNode;
  resolver: string;
}

interface GetEntitiesOptions extends QueryOptions {
  variables?: Record<string, unknown>;
}

interface GetSingleEntityOptions extends QueryOptions {
  expectToFail?: boolean;
}

interface MutateEntityOptions extends QueryOptions {
  anonym: string;
  extraVariables?: Record<string, unknown>;
}

interface DeleteEntityOptions extends QueryOptions {
  verifyDelete: () => void;
}

export interface SubmitEntityResponse {
  id: number;
}
