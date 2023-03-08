import { Dimmer, Loader, SemanticSIZES } from "semantic-ui-react";

interface Props {
  active?: boolean;
  inverted?: boolean;
  size?: SemanticSIZES;
  content?: string;
}

const LoadingComponent = ({
  active = true,
  inverted = true,
  size = "massive",
  content = "Loading...",
}: Props) => {
  return (
    <Dimmer active={active} inverted={inverted}>
      <Loader size={size} content={content} inline="centered" />
    </Dimmer>
  );
};
export default LoadingComponent;
