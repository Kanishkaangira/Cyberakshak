import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

/** Convert a Firestore document into the fields used by the event cards. */
export function normalizeEventDoc(doc) {
  const data = doc.data();
  const title = data.title ?? data.Title;
  const description = data.description ?? data.Description;
  const date = data.date ?? data.Date;
  const time = data.time ?? data.Time;
  const venue = data.venue ?? data.Venue;
  const category = data.category ?? data.Category;
  const imageUrl = data.imageUrl ?? data.ImageUrl;
  const dateValue =
    date && typeof date.toDate === 'function'
      ? date.toDate()
      : date == null
        ? null
        : new Date(date);
  const validDate = dateValue && !Number.isNaN(dateValue.getTime());

  return {
    id: doc.id,
    title: typeof title === 'string' ? title : '',
    description: typeof description === 'string' ? description : '',
    date:
      validDate && typeof date.toDate === 'function'
        ? dateValue.toLocaleDateString()
        : date == null
          ? ''
          : String(date),
    day: validDate ? String(dateValue.getDate()).padStart(2, '0') : '--',
    month: validDate
      ? dateValue.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      : '---',
    time: typeof time === 'string' ? time : '',
    venue: typeof venue === 'string' ? venue : '',
    category: typeof category === 'string' ? category : '',
    imageUrl: typeof imageUrl === 'string' ? imageUrl : '',
  };
}

/** Subscribe to live changes in the Firestore events collection. */
export function subscribeToEvents(onEventsUpdate, onError) {
  return onSnapshot(
    collection(db, 'events'),
    (snapshot) => onEventsUpdate(snapshot.docs.map(normalizeEventDoc)),
    onError,
  );
}

/** Fetch the current events collection, used by pull-to-refresh. */
export async function fetchEventsOnce() {
  const snapshot = await getDocs(collection(db, 'events'));
  return snapshot.docs.map(normalizeEventDoc);
}
