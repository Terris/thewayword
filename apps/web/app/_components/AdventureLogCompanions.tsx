import { Id, api } from "@repo/convex";
import { useQuery } from "convex/react";
import Link from "next/link";
import { Fragment } from "react";

export function AdventureLogCompanions({
  companionUserIds,
}: {
  companionUserIds?: Id<"users">[];
}) {
  if (!companionUserIds || !companionUserIds.length) return null;
  return (
    <>
      {" "}
      with{" "}
      {companionUserIds.map((userId, index) => (
        <Fragment key={userId}>
          <Link
            href={`/user/${userId}/adventure-logs`}
            className="inline-flex items-center cursor-pointer hover:text-amber-400"
          >
            <AdventureLogCompanion companionUserId={userId} />
          </Link>
          {index < companionUserIds.length - 2 ? ", " : null}
          {companionUserIds.length > 1 && index === companionUserIds.length - 2
            ? " & "
            : null}
        </Fragment>
      ))}
    </>
  );
}

function AdventureLogCompanion({
  companionUserId,
}: {
  companionUserId: Id<"users">;
}) {
  const user = useQuery(api.users.sessionedFindPublicUserById, {
    id: companionUserId,
  });
  if (!user) return null;
  return `${user.name} `;
}
