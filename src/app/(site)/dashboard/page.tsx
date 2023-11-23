import { getAuthSession } from "~/lib/auth";
import { Logout } from "~/components/logout";

export default async function Dashboard() {
  const session = await getAuthSession();
  return (
    <div>
      Dashboard - {session?.user?.name} <Logout />
    </div>
  );
}
