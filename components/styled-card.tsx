import { View } from 'react-native';
import styled from 'styled-components/native';
import { H1 } from './styled-title';

export const StyledCard = styled.View`
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Card = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {title && <H1>{title}</H1>}
      <StyledCard>{children}</StyledCard>
    </View>
  );
};
