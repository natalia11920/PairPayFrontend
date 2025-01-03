"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getFriendsAPI } from "../../services/FriendShipServices";
import { Friend } from "../../types/Friends";
import { BillDisplay } from "../../types/Bill";
import { getDebtBalancesAPI } from "../../services/DebtServices";

export default function HomePage() {
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentBills, setRecentBills] = useState<BillDisplay[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const friendsData = await getFriendsAPI();
      const totalBalanceData = await getDebtBalancesAPI();
      setFriends(friendsData);
      setTotalBalance(totalBalanceData);
    } catch (error) {
      toast.error("Error fetching friends or emails:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <section className="text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Here's an overview of your recent activity
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="w-full">
          <CardHeader className="flex gap-3">
            <Icon
              icon="mdi:wallet"
              className="text-secondary"
              width={24}
              height={24}
            />
            <p className="text-md font-semibold">Total Balance</p>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Spinner size="lg" color="secondary" />
              </div>
            ) : (
              <div>
                <p
                  className={`text-2xl font-bold ${
                    totalBalance >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  ${Math.abs(totalBalance).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {totalBalance >= 0 ? "You're owed" : "You owe"}
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex gap-3">
            <Icon
              icon="mdi:file-document-multiple"
              className="text-secondary"
              width={24}
              height={24}
            />
            <p className="text-md font-semibold">Recent Bills</p>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Spinner size="lg" color="secondary" />
              </div>
            ) : (
              <div>
                <ul className="space-y-2">
                  {recentBills.map((bill) => (
                    <li
                      key={bill.id}
                      className="flex justify-between items-center"
                    >
                      <span>{bill.name}</span>
                      <span className="font-semibold">
                        ${bill.total_sum.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex gap-3">
            <Icon
              icon="mdi:account-group"
              className="text-secondary"
              width={24}
              height={24}
            />
            <p className="text-md font-semibold">Friends</p>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Spinner size="lg" color="secondary" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {friends.map((friend) => (
                  <Avatar
                    alt={friend.name}
                    key={friend.id}
                    name={friend.name}
                    color="secondary"
                    size="sm"
                  />
                ))}
                <Button
                  isIconOnly
                  variant="flat"
                  className="text-default-900 bg-default-100"
                  aria-label="Add friend"
                >
                  <Icon icon="mdi:plus" width={24} height={24} />
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
      <Divider className="my-4" />
      {/* <section>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            as={Link}
            to="/create-bill"
            color="secondary"
            startContent={<Icon icon="mdi:plus" />}
          >
            Create New Bill
          </Button>
          <Button
            as={Link}
            to="/settle-up"
            color="secondary"
            startContent={<Icon icon="mdi:cash-multiple" />}
          >
            Settle Up
          </Button>
          <Button
            as={Link}
            to="/friends"
            variant="bordered"
            startContent={<Icon icon="mdi:account-plus" />}
          >
            Add Friends
          </Button>
        </div>
      </section> */}
    </div>
  );
}
