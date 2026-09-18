import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

interface PlaceholderPanelProps {
  id: string;
  title: string;
  message: string;
}

export default function PlaceholderPanel({
  id,
  title,
  message,
}: Readonly<PlaceholderPanelProps>) {
  return (
    <div id={id}>
      <Heading
        id={`${id}-title`}
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        {title}
      </Heading>
      <Text id={`${id}-message`} variant="muted">
        {message}
      </Text>
    </div>
  );
}
