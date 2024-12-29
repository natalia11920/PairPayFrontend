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
import {
  acceptBillInvitationAPI,
  declineBillInvitationAPI,
  getBillInvitationsAPI,
} from "../../services/BillServices";

const NotificationDropdown = () => {
  const [friendInvitations, setFriendInvitations] = useState<
    { id: number; mail: string; user_id: string }[]
  >([]);
  const [billInvitations, setBillInvitations] = useState<any[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const [pendingRequests, billInvites] = await Promise.all([
        getPendingRequestsAPI(),
        getBillInvitationsAPI(),
      ]);
      setFriendInvitations(
        pendingRequests.map((request: any) => ({
          id: request.id,
          mail: request.mail,
          user_id: request.user_id,
        }))
      );

      setBillInvitations(billInvites || []);
    } catch (error) {
      toast.error("Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  };

  const totalNotifications =
    friendInvitations.filter((inv) => !acceptedIds.includes(inv.id)).length +
    billInvitations.length;

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
      setFriendInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== id)
      );
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  const handleAcceptBillInvite = async (id: number) => {
    try {
      await acceptBillInvitationAPI(id);
      setBillInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== id)
      );
    } catch (error) {
      toast.error("Failed to accept bill invitation");
    }
  };

  const handleDeclineBillInvite = async (id: number) => {
    try {
      await declineBillInvitationAPI(id);
      setBillInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== id)
      );
    } catch (error) {
      toast.error("Failed to decline bill invitation");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-20">
          <Spinner size="md" color="secondary" />
        </div>
      );
    }

    if (friendInvitations.length === 0 && billInvitations.length === 0) {
      return <p>No notifications</p>;
    }

    return (
      <>
        {friendInvitations.length > 0 && (
          <div key="friend-invitations">
            <p className="mb-2 font-bold mt-4">Friend Invitations</p>
            {friendInvitations.map((invitation) => (
              <Card
                key={`friend-${invitation.id}`}
                className="p-2 mb-2 mt-2 w-full"
              >
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
            ))}
          </div>
        )}

        {billInvitations.length > 0 && (
          <div key="bill-invitations">
            <p className="mb-2 font-bold">Bill Invitations</p>
            {billInvitations.map((invitation) => (
              <Card
                key={`bill-${invitation.id}`}
                className="p-2 mb-2 mt-2 w-full"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{invitation.bill_name}</p>
                    <p className="text-sm text-gray-500">
                      From: {invitation.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      className="ms-2 rounded-lg"
                      color="success"
                      variant="light"
                      aria-label="Accept"
                      onClick={() => handleAcceptBillInvite(invitation.id)}
                    >
                      <Icon icon="mdi:check" width={18} height={18} />
                    </Button>
                    <Button
                      isIconOnly
                      className="rounded-lg"
                      color="danger"
                      variant="light"
                      aria-label="Decline"
                      onClick={() => handleDeclineBillInvite(invitation.id)}
                    >
                      <Icon icon="mdi:close" width={18} height={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </>
    );
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
          content={totalNotifications}
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

        <PopoverContent className="w-80">{renderContent()}</PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationDropdown;
