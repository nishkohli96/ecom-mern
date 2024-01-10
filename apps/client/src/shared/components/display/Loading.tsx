import { ContentContainer, CenterContent } from 'shared';
import CircularProgress from '@mui/material/CircularProgress';

export const Loading = () => (
  <ContentContainer>
    <CenterContent>
      <CircularProgress size={60} />
    </CenterContent>
  </ContentContainer>
);
