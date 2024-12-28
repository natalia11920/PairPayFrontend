import {
  Badge,
  Button,
  Card,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";
import { NotificationIcon } from "../../assets/NotificationIcon";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import {
  acceptRequestAPI,
  declineRequestAPI,
  getPendingRequestsAPI,
} from "../../services/FriendShipServices";
import { toast } from "react-toastify";

const NotificationDropdown = () => {
  const [invitations, setInvitations] = useState<
    { id: number; mail: string; user_id: string }[]
  >([]);
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const pendingRequests = await getPendingRequestsAPI();
      setInvitations(
        pendingRequests.map((request: any) => ({
          id: request.id,
          mail: request.mail,
          user_id: request.user_id,
        }))
      );
    } catch (error) {
      toast.error("Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();

    const pollInterval = setInterval(() => {
      fetchInvitations();
    }, 100000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleAccept = async (id: number) => {
    try {
      await acceptRequestAPI(id);
      setAcceptedIds((prev) => [...prev, id]);
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await declineRequestAPI(id);
      setInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== id)
      );
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  return (
    <div className="relative">
      <Popover
        placement="bottom-end"
        onOpenChange={(open) => {
          if (open) {
            fetchInvitations();
          }
        }}
      >
        <Badge
          content={
            invitations.filter((inv) => !acceptedIds.includes(inv.id)).length
          }
          shape="circle"
          color="secondary"
          className="border-none"
        >
          <PopoverTrigger>
            <Button
              radius="full"
              isIconOnly
              aria-label="open notifications"
              variant="light"
            >
              <NotificationIcon size={24} />
            </Button>
          </PopoverTrigger>
        </Badge>

        <PopoverContent className="w-80">
          <p className="mb-2 font-bold">Friend Invitations</p>
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <Spinner size="md" color="secondary" />
            </div>
          ) : invitations.length === 0 ? (
            <p>No invitations</p>
          ) : (
            invitations.map((invitation) => (
              <Card key={invitation.id} className="p-2 mb-2 mt-2 w-full">
                <div className="flex items-center justify-between">
                  <p>{invitation.mail}</p>
                  {!acceptedIds.includes(invitation.id) ? (
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        className="ms-2 rounded-lg"
                        color="success"
                        variant="light"
                        aria-label="Accept"
                        onClick={() => handleAccept(invitation.id)}
                      >
                        <Icon icon="mdi:check" width={18} height={18} />
                      </Button>
                      <Button
                        isIconOnly
                        className="rounded-lg"
                        color="danger"
                        variant="light"
                        aria-label="Decline"
                        onClick={() => handleDecline(invitation.id)}
                      >
                        <Icon icon="mdi:close" width={18} height={18} />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-success">Accepted</p>
                  )}
                </div>
              </Card>
            ))
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationDropdown;
