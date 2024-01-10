import { ReactElement } from 'react';
import { CenterContent, FormContainer, Header4Text } from 'shared';
import Box from '@mui/material/Box';
interface FormPageProps {
  children: ReactElement;
  formTitle?: string;
}

export const FormPage = ({ children, formTitle }: FormPageProps) => {
  return (
    <CenterContent>
      <FormContainer>
        {formTitle && <Header4Text>{formTitle}</Header4Text>}
        <Box sx={{ mt: '3rem' }}>{children}</Box>
      </FormContainer>
    </CenterContent>
  );
};

FormPage;
