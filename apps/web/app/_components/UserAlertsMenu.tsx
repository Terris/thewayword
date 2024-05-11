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
  const markOneRead = useMutation(api.userAlerts.markOneReadById);

  return (
    <DropdownMenu>
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
              count={unreadAlertCount}
              className="absolute -top-2 -right-2"
            />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 p-2">
        {userAlerts.map((alert) => (
          <DropdownMenuItem
            key={alert._id}
            onClick={async () => {
              if (!alert.read) {
                await markOneRead({ id: alert._id });
              }
              alert.link ? router.push(alert.link) : null;
            }}
            className={cn("cursor-pointer mb-1", !alert.read && "bg-accent")}
          >
            {alert.message}
          </DropdownMenuItem>
        ))}
        {alertCount && unreadAlertCount ? (
          <DropdownMenuItem
            onClick={() => {
              void markAllRead();
            }}
            className="cursor-pointer font-soleil font-bold text-xs py-2"
          >
            Mark all as read
          </DropdownMenuItem>
        ) : null}
        {!alertCount ? <Text className="text-sm p-2">No messages</Text> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
