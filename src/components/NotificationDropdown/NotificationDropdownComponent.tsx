import {
  Badge,
  Button,
  Card,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Avatar,
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
  const [acceptedFriendIds, setAcceptedFriendIds] = useState<number[]>([]);
  const [acceptedBillIds, setAcceptedBillIds] = useState<number[]>([]);
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
    friendInvitations.filter((inv) => !acceptedFriendIds.includes(inv.id))
      .length +
    billInvitations.filter(
      (inv) => !acceptedBillIds.includes(inv.invitation_id)
    ).length;

  useEffect(() => {
    fetchInvitations();

    const pollInterval = setInterval(() => {
      fetchInvitations();
    }, 100000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleAcceptFriend = async (id: number) => {
    try {
      await acceptRequestAPI(id);
      setAcceptedFriendIds((prev) => [...prev, id]);
      toast.success("Friend request accepted");
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineFriend = async (id: number) => {
    try {
      await declineRequestAPI(id);
      setFriendInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== id)
      );
      toast.info("Friend request declined");
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  const handleAcceptBillInvite = async (id: number) => {
    try {
      await acceptBillInvitationAPI(id);
      setAcceptedBillIds((prev) => [...prev, id]);
      toast.success("Bill invitation accepted");
    } catch (error) {
      toast.error("Failed to accept bill invitation");
    }
  };

  const handleDeclineBillInvite = async (id: number) => {
    try {
      await declineBillInvitationAPI(id);
      setBillInvitations((prev) =>
        prev.filter((invitation) => invitation.invitation_id !== id)
      );
      toast.info("Bill invitation declined");
    } catch (error) {
      toast.error("Failed to decline bill invitation");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-20">
          <Spinner size="sm" color="secondary" />
        </div>
      );
    }

    if (friendInvitations.length === 0 && billInvitations.length === 0) {
      return <p className="text-center text-gray-500 py-4">No notifications</p>;
    }

    return (
      <>
        {friendInvitations.length > 0 && (
          <div key="friend-invitations">
            <p className="text-sm font-semibold mb-2 text-default-600">
              Friend Invitations
            </p>
            {friendInvitations.map((invitation) => (
              <Card
                key={`friend-${invitation.id}`}
                className="p-3 mb-2 bg-content2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      alt={invitation.mail}
                      name={invitation.mail}
                      size="sm"
                      color="secondary"
                    />
                    <p className="text-sm">{invitation.mail}</p>
                  </div>
                  {!acceptedFriendIds.includes(invitation.id) ? (
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        color="success"
                        variant="flat"
                        aria-label="Accept"
                        onClick={() => handleAcceptFriend(invitation.id)}
                      >
                        <Icon icon="mdi:check" width={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        aria-label="Decline"
                        onClick={() => handleDeclineFriend(invitation.id)}
                      >
                        <Icon icon="mdi:close" width={16} />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-success text-xs">Accepted</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {billInvitations.length > 0 && (
          <div key="bill-invitations">
            <p className="text-sm font-semibold mb-2 text-default-600">
              Bill Invitations
            </p>
            {billInvitations.map((invitation) => (
              <Card
                key={`bill-${invitation.invitation_id}`}
                className="p-3 mb-2 bg-content2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {invitation.bill_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      From: {invitation.email}
                    </p>
                  </div>
                  {!acceptedBillIds.includes(invitation.invitation_id) ? (
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        color="success"
                        variant="flat"
                        aria-label="Accept"
                        onClick={() =>
                          handleAcceptBillInvite(invitation.invitation_id)
                        }
                      >
                        <Icon icon="mdi:check" width={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        aria-label="Decline"
                        onClick={() =>
                          handleDeclineBillInvite(invitation.invitation_id)
                        }
                      >
                        <Icon icon="mdi:close" width={16} />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-success text-xs">Accepted</p>
                  )}
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
        <PopoverTrigger>
          <Button
            isIconOnly
            variant="light"
            radius="full"
            aria-label="Open notifications"
          >
            <Badge
              content={totalNotifications}
              color="danger"
              shape="circle"
              size="sm"
              className="border-none"
            >
              <NotificationIcon size={24} />
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 max-h-[400px] overflow-y-auto p-2">
          {renderContent()}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationDropdown;
