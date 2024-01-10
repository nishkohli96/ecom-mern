import { Header1Text } from 'shared';

interface StatusMessageProps {
  text: string;
}

export const StatusMessage = ({ text }: StatusMessageProps) => (
  <Header1Text>{text}</Header1Text>
);
