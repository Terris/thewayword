import { Bell } from "lucide-react";
import {
  Button,
  CountBadge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from "@repo/ui";
import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@repo/convex";
import { useRouter } from "next/navigation";
import { cn } from "@repo/utils";

export function UserAlertsMenu() {
  const router = useRouter();

  const { results: userAlerts } = usePaginatedQuery(
    api.userAlerts.paginatedFindAllBySessionedUser,
    {},
    {
      initialNumItems: 6,
    }
  );
  const alertCount = userAlerts.length;
  const unreadAlertCount = userAlerts.filter((alert) => !alert.read).length;

  const markAllRead = useMutation(api.userAlerts.markAllReadBySessionedUser);

  return (
    <DropdownMenu
      onOpenChange={() => {
        void markAllRead();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative rounded-full flex-shrink-0 ",
            unreadAlertCount && "bg-muted"
          )}
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadAlertCount ? (
            <CountBadge
              count={alertCount}
              className="absolute -top-2 -right-2"
            />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        {userAlerts.map((alert) => (
          <DropdownMenuItem
            key={alert._id}
            onClick={() => {
              alert.link ? router.push(alert.link) : null;
            }}
            className="cursor-pointer"
          >
            {alert.message}
          </DropdownMenuItem>
        ))}
        {!alertCount ? <Text className="text-sm p-2">No messages</Text> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
