import styled from 'styled-components';

const Button = styled.button`
  border: 2px solid ${(props) => props.theme.main};
  border-radius: 3px;
  color: ${(props) => props.theme.main};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
`;
