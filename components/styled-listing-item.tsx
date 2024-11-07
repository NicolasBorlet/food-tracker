import styled from 'styled-components/native';

export const StyledListingItem = styled.View`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  flex-direction: row;
  margin-bottom: 16px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

export const ListingItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledListingItem>
      {children}
    </StyledListingItem>
  );
};
