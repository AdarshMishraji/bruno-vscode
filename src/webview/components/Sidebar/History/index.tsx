import { useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'utils/ipc';
import HistoryItem, { HistoryEntry } from './HistoryItem';
import StyledWrapper from './StyledWrapper';

const History = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const refetch = useCallback(() => {
    ipcRenderer.invoke<HistoryEntry[]>('history:get-entries')
      .then((result) => setEntries(result || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refetch();
    const unsubscribe = ipcRenderer.on('history:changed', refetch);
    return unsubscribe;
  }, [refetch]);

  const handleOpen = (entry: HistoryEntry) => {
    ipcRenderer.send('sidebar:open-history-entry', { id: entry.id });
  };

  const handleRemove = (id: string) => {
    ipcRenderer.invoke('history:remove-entry', id).catch(() => {});
  };

  return (
    <StyledWrapper>
      {entries.length === 0 ? (
        <div className="history-empty-state">No requests sent yet.</div>
      ) : (
        entries.map((entry) => (
          <HistoryItem key={entry.id} entry={entry} onOpen={handleOpen} onRemove={handleRemove} />
        ))
      )}
    </StyledWrapper>
  );
};

export default History;
