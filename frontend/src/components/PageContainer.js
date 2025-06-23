import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100%; /* Fills parent (ContentArea), not entire viewport */
  display: flex;
  flex-direction: column;
  background: ${({ bgColor }) => bgColor || 'transparent'};
  padding: ${({ padding }) => padding || '0'};
  margin: 0;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;

  /* Responsive padding adjustments */
  @media (max-width: 1024px) {
    padding: ${({ padding }) => padding || '0'};
  }

  @media (max-width: 768px) {
    padding: ${({ mobilePadding }) => mobilePadding || '0'};
  }
`;

export default PageContainer;