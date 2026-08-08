import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  color: var(--vscode-sideBar-foreground, var(--vscode-foreground, #cccccc));

  &:hover {
    background-color: var(--vscode-list-hoverBackground, rgba(255, 255, 255, 0.05));

    .history-item-remove {
      visibility: visible;
    }
  }

  .history-item-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .history-item-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .history-item-url {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11px;
    opacity: 0.65;
  }

  .history-item-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .history-item-status {
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  .history-item-time {
    font-size: 11px;
    opacity: 0.6;
    white-space: nowrap;
  }

  .history-item-remove {
    visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

export default StyledWrapper;
