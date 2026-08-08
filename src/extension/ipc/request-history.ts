import { registerHandler, broadcastToAllWebviews } from './handlers';
import { requestHistoryStore } from '../store/request-history';

export function registerRequestHistoryIpc(): void {
  registerHandler('history:get-entries', async () => {
    return requestHistoryStore.getEntries();
  });

  registerHandler('history:remove-entry', async (args) => {
    const [id] = args as [string];
    if (id) {
      requestHistoryStore.removeEntry(id);
      broadcastToAllWebviews('history:changed');
    }
    return null;
  });

  registerHandler('history:clear', async () => {
    requestHistoryStore.clear();
    broadcastToAllWebviews('history:changed');
    return null;
  });
}
