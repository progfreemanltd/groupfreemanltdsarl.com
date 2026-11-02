import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

const projectId = 'demo-freeman-firestore-rules';
let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8'),
    },
  });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'cms_content', 'homepage'), { heroTitle: 'Public title' });
    await setDoc(doc(db, 'cms_content', 'contact'), { email: 'public@example.test' });
    await setDoc(doc(db, 'formations', 'published'), { title: 'Visible', published: true });
    await setDoc(doc(db, 'formations', 'draft'), { title: 'Draft', published: false });
    await setDoc(doc(db, 'users', 'admin-user'), { role: 'super_admin' });
    await setDoc(doc(db, 'cms_private', 'contact_integrations'), {
      newsletterWebhookUrl: 'https://private.example.test/webhook',
    });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test('public readers can load only the explicit homepage and safe contact document', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, 'cms_content', 'homepage')));
  await assertSucceeds(getDoc(doc(db, 'cms_content', 'contact')));
  await assertFails(getDoc(doc(db, 'cms_private', 'contact_integrations')));
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'cms_content', 'contact'), {
      email: 'public@example.test',
      newsletterWebhookUrl: 'https://private.example.test/webhook',
    });
  });
  await assertFails(getDoc(doc(db, 'cms_content', 'contact')));
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'cms_content', 'contact'), { email: 'public@example.test' });
  });
  await assertSucceeds(getDoc(doc(db, 'cms_content', 'contact')));
  await assertFails(setDoc(doc(db, 'cms_private', 'contact_integrations'), { url: 'https://example.test' }));
});

test('public formation query must filter published records', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const publishedQuery = query(collection(db, 'formations'), where('published', '==', true));
  const results = await assertSucceeds(getDocs(publishedQuery));
  assert.equal(results.size, 1);
  await assertFails(getDocs(collection(db, 'formations')));
});

test('super admins can view drafts and private contact integrations', async () => {
  const db = testEnv.authenticatedContext('admin-user').firestore();
  const formations = await assertSucceeds(getDocs(collection(db, 'formations')));
  assert.equal(formations.size, 2);
  await assertSucceeds(getDoc(doc(db, 'cms_private', 'contact_integrations')));
});
