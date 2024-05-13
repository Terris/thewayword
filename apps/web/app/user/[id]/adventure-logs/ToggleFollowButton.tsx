import { type Id, api } from "@repo/convex";
import { Button } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { useMutation, useQuery } from "convex/react";

export function ToggleFolowButton({
  followeeUserId,
}: {
  followeeUserId: Id<"users">;
}) {
  const { toast } = useToast();

  const publicUser = useQuery(api.users.sessionedFindPublicUserById, {
    id: followeeUserId,
  });

  const isFollowing = useQuery(
    api.follows.findFollowBySessionedUserAndFolloweeUserId,
    {
      followeeUserId,
    }
  );
  const isLoading = isFollowing === undefined;

  const toggleFollow = useMutation(
    api.follows.toggleFollowBySessionedUserAndFolloweeUserId
  );

  async function handleToggleFollow() {
    try {
      await toggleFollow({ followeeUserId });
      toast({
        title: "Success",
        description: `You're ${
          isFollowing ? "no longer following" : "now following"
        } ${publicUser?.name}`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  if (isLoading) return null;

  return (
    <Button onClick={() => handleToggleFollow()}>
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
