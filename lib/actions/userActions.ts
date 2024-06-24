'use server';

import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';
import { parseStringify } from '../utils';

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const res = await account.createEmailPasswordSession(email, password);

    return parseStringify(res);
  } catch (err) {
    console.log('Error: ', err);
  }
};

export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams) => {
  try {
    // Create user account
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (err) {
    console.log('Sign up error: ', err);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
