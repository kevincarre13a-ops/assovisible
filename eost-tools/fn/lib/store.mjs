import { getStore } from '@netlify/blobs';

let factory = null;
/** Permet aux tests locaux de remplacer Netlify Blobs par une mémoire en RAM. */
export function setStoreFactory(f) { factory = f; }
export function openStore(name) {
  const f = factory || globalThis.__EOST_STORE_FACTORY__;
  if (f) return f(name);
  return getStore({ name, consistency: 'strong' });
}
export const pagesStore = () => openStore('eost-pages');
export const mediaStore = () => openStore('eost-media');
export const messagesStore = () => openStore('eost-messages');
export const authStore = () => openStore('eost-auth');
