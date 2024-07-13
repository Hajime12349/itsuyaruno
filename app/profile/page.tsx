import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignoutButton from "@/components/SignOutButton";
import SigninButton from "@/components/SignInButton";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  let identifier = "";
  if (user && "id" in user) {
    identifier = user.id as string;
  }

  return (
    <>
      <p>Profile Page</p>
      {!user ? (
        <SigninButton />
      ) : (
        <>
          <div>
            <img
              src={user.image ? user.image : "/images/default.png"}
              className="max-h-36"
              alt={`profile photo of ${user.name}`}
            />
          </div>
          <div className="mt-8">
            <p className="mb-3">Name: {user.name}</p>
            <p className="mb-3">Email: {user.email}</p>
            <p className="mb-3">id: {identifier}</p>
          </div>
          <SignoutButton />
        </>
      )}
    </>
  );
}