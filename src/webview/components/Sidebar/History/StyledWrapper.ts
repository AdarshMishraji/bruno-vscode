import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .history-empty-state {
    padding: 16px;
    text-align: center;
    font-size: 12px;
    opacity: 0.7;
    color: var(--vscode-descriptionForeground, var(--vscode-foreground, #999999));
  }
`;

export default StyledWrapper;
