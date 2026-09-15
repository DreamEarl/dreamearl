import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import { translations } from "@/lib/constants/translations";

interface ProfileHeaderProps {
  name: string;
  email: string;
}

export default function ProfileHeader({
  name,
  email,
}: Readonly<ProfileHeaderProps>) {
  const { account } = translations;

  return (
    <div className="text-center mb-10">
      <span className="inline-block text-sm tracking-widest uppercase border-b-2 border-black pb-2 mb-8">
        {account.title}
      </span>
      <Heading variant="login" className="mb-2">
        {account.greeting} <span className="italic font-normal">{name}</span>
      </Heading>
      <Text variant="muted">{email}</Text>
    </div>
  );
}
