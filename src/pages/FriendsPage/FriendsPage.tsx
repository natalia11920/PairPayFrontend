import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Button,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { getFriendsAPI } from "../../services/FriendShipServices";
import { Friend } from "../../types/Friends";
import { getUsersEmailsAPI } from "../../services/UserServices";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import AddFriendModal from "../../components/AddFriendModal/AddFriendModal";

const FriendsPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allEmails, setAllEmails] = useState<string[]>([]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const friendsData = await getFriendsAPI();
      setFriends(friendsData);

      const indexedEmails = await fetchIndexedEmails();
      setAllEmails(indexedEmails);
    } catch (error) {
      toast.error("Error fetching friends or emails:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchIndexedEmails = async (): Promise<string[]> => {
    const emails = await getUsersEmailsAPI();
    return emails;
  };

  const calculateNetDebt = (debtInfo: Friend["debt_info"]) => {
    if (Array.isArray(debtInfo)) {
      return debtInfo.reduce((acc, debt) => acc + (debt.net_debt || 0), 0);
    }
    return 0;
  };

  const getDebtStatusColor = (debtInfo: Friend["debt_info"]) => {
    const netDebt = calculateNetDebt(debtInfo);
    if (netDebt === 0) return "default";
    return netDebt > 0 ? "success" : "danger";
  };

  const formatDebtAmount = (debtInfo: Friend["debt_info"]) => {
    const netDebt = calculateNetDebt(debtInfo);
    if (netDebt === 0) return "No debt";
    const amount = Math.abs(netDebt);
    return netDebt > 0
      ? `They owe you $${amount.toFixed(2)}`
      : `You owe $${amount.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4 max-w-4xl mx-auto">
      <Card className="w-full shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center px-6 py-4">
          <h2 className="text-2xl font-bold">Friends List</h2>
          <Button
            color="secondary"
            onPress={() => setIsModalOpen(true)}
            startContent={<Icon icon="mdi:account-plus" width={20} />}
          >
            Add New Friend
          </Button>
        </CardHeader>
        <CardBody className="px-6 py-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <Card
                    key={friend.id}
                    isPressable
                    className="w-full hover:shadow-md transition-shadow duration-200"
                  >
                    <CardBody className="flex flex-row justify-between items-center p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          icon={`${friend.name}`}
                          size="md"
                          color="secondary"
                        />
                        <div>
                          <p className="text-base font-semibold">
                            {friend.mail}
                          </p>
                          <p className="text-xs text-gray-500">
                            {friend.name} {friend.surname}
                          </p>
                        </div>
                      </div>
                      <Chip
                        color={getDebtStatusColor(friend.debt_info)}
                        variant="flat"
                      >
                        {formatDebtAmount(friend.debt_info)}
                      </Chip>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-2">
                  No friends found. Add some friends to get started!
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <AddFriendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allEmails={allEmails}
      />
    </div>
  );
};

export default FriendsPage;
