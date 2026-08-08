import moment from 'moment';
import { IconX } from '@tabler/icons';
import RequestMethod from 'components/Sidebar/Collections/Collection/CollectionItem/RequestMethod';
import ActionIcon from 'ui/ActionIcon';
import StyledWrapper from './StyledWrapper';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  itemName: string;
  itemType: string;
  status?: number;
  statusText?: string;
  error?: string;
}

interface HistoryItemProps {
  entry: HistoryEntry;
  onOpen: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
}

const getStatusColor = (entry: HistoryEntry): string => {
  if (entry.error || entry.statusText === 'Error') {
    return 'var(--vscode-errorForeground, #f14c4c)';
  }
  if (typeof entry.status === 'number' && entry.status > 0) {
    if (entry.status < 300) return 'var(--vscode-terminal-ansiGreen, #89d185)';
    if (entry.status < 400) return 'var(--vscode-terminal-ansiYellow, #cca700)';
    return 'var(--vscode-errorForeground, #f14c4c)';
  }
  return 'var(--vscode-descriptionForeground, #999999)';
};

const getStatusLabel = (entry: HistoryEntry): string => {
  if (typeof entry.status === 'number' && entry.status > 0) {
    return String(entry.status);
  }
  return entry.statusText || '';
};

const HistoryItem = ({ entry, onOpen, onRemove }: HistoryItemProps) => {
  return (
    <StyledWrapper onClick={() => onOpen(entry)} title={entry.url}>
      <RequestMethod item={{ type: entry.itemType, request: { method: entry.method } }} />
      <div className="history-item-main">
        <span className="history-item-name">{entry.itemName}</span>
        <span className="history-item-url">{entry.url}</span>
      </div>
      <div className="history-item-meta">
        <span className="history-item-status" style={{ color: getStatusColor(entry) }}>
          {getStatusLabel(entry)}
        </span>
        <span className="history-item-time">{moment(entry.timestamp).fromNow()}</span>
        <ActionIcon
          className="history-item-remove"
          size="sm"
          label="Remove from history"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onRemove(entry.id);
          }}
        >
          <IconX size={12} stroke={1.5} />
        </ActionIcon>
      </div>
    </StyledWrapper>
  );
};

export default HistoryItem;
