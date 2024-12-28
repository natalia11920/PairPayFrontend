import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Spinner,
  CardFooter,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useState, useEffect, useMemo } from "react";
import { BillCreate, BillDisplay } from "../../types/Bill";
import {
  createBillAPI,
  getBillsCreatedAPI,
  getBillsParticipatedAPI,
  deleteBillAPI,
} from "../../services/BillServices";
import { PaginationComponent } from "../../components/Pagination/PaginationComponent";
import { toast } from "react-toastify";
import { CreateBillModal } from "../../components/CreateBillModal/CreateBillModal";
import { BillDetailsModal } from "../../components/BillDetailsModal/BillDetailsModal";
import { useAuth } from "../../contexts/AuthContext";
import { getFriendListAPI } from "../../services/UserServices";

type Props = {};

const BillsPage = (props: Props) => {
  const { user } = useAuth();

  const [createdBills, setCreatedBills] = useState<BillDisplay[]>([]);
  const [participatedBills, setParticipatedBills] = useState<BillDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const [createdPage, setCreatedPage] = useState(1);
  const [participatedPage, setParticipatedPage] = useState(1);
  const [createdTotalItems, setCreatedTotalItems] = useState(0);
  const [participatedTotalItems, setParticipatedTotalItems] = useState(0);

  const [activeTab, setActiveTab] = useState<string>("created");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<number | null>(null);

  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);

  const handleCreateBill = async (billData: BillCreate) => {
    try {
      setLoading(true);
      const response = await createBillAPI(billData);
      if (activeTab === "created") {
        await fetchData();
      }

      setIsModalOpen(false);
      toast.success("Bill created successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error creating bill: ${error.message}`);
      } else {
        toast.error("Error creating bill. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async () => {
    if (!billToDelete) return;

    try {
      setLoading(true);
      await deleteBillAPI(billToDelete);
      await fetchData();
      setIsDeleteModalOpen(false);
      setBillToDelete(null);
      toast.success("Bill deleted successfully!");
    } catch (error) {
      toast.error("Error deleting bill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (billId: number) => {
    setBillToDelete(billId);
    setIsDeleteModalOpen(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "created") {
        const createdResponse = await getBillsCreatedAPI(createdPage, 4);
        const response = await getFriendListAPI();
        console.log(response);
        setCreatedBills(createdResponse.bills);
        setCreatedTotalItems(createdResponse.totalItems);
      } else {
        const participatedResponse = await getBillsParticipatedAPI(
          participatedPage,
          4
        );
        setParticipatedBills(participatedResponse.bills);
        setParticipatedTotalItems(participatedResponse.totalItems);
      }
    } catch (error) {
      toast.error(`Error fetching data`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, createdPage, participatedPage]);

  const handleCreatedPageChange = (page: number) => {
    setCreatedPage(page);
  };

  const handleParticipatedPageChange = (page: number) => {
    setParticipatedPage(page);
  };

  const handleBillClick = (billId: number) => {
    setSelectedBillId(billId);
  };

  const tabs = useMemo(
    () => [
      {
        id: "created",
        label: "Created Bills",
        content: createdBills.length ? (
          createdBills.map((bill) => (
            <Card
              key={bill.id}
              isPressable
              className="mb-4"
              onPress={() => handleBillClick(bill.id)}
            >
              <CardHeader className="flex justify-between items-center">
                <h3>{bill.name}</h3>
              </CardHeader>
              <CardBody>
                <p>Amount: ${bill.total_sum}</p>
                <p>Created: {new Date(bill.created_at).toLocaleString()}</p>
              </CardBody>
            </Card>
          ))
        ) : (
          <p>No created bills found.</p>
        ),
      },
      {
        id: "participating",
        label: "Participating Bills",
        content: participatedBills.length ? (
          participatedBills.map((bill) => (
            <Card
              key={bill.id}
              isPressable
              className="mb-4"
              onPress={() => handleBillClick(bill.id)}
            >
              <CardHeader>
                <h3>{bill.name}</h3>
              </CardHeader>
              <CardBody>
                <p>Amount: ${bill.total_sum}</p>
                <p>Created: {new Date(bill.created_at).toLocaleString()}</p>
              </CardBody>
            </Card>
          ))
        ) : (
          <p>No participating bills found.</p>
        ),
      },
    ],
    [createdBills, participatedBills]
  );

  return (
    <div className="flex flex-col items-center mt-10">
      <Card className="w-full max-w-3xl p-2">
        <CardHeader className="flex flex-row justify-between">
          <h2 className="text-2xl font-bold">Bills Manager</h2>
          <Button color="secondary" onPress={() => setIsModalOpen(true)}>
            Create new bill
          </Button>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : (
            <Tabs
              aria-label="Bills Tabs"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              className="block"
            >
              {tabs.map((tab) => (
                <Tab key={tab.id} title={tab.label}>
                  <div className="flex flex-col gap-3">{tab.content}</div>
                </Tab>
              ))}
            </Tabs>
          )}
        </CardBody>
        <CardFooter className="flex justify-end">
          {activeTab === "created" && (
            <PaginationComponent
              totalItems={createdTotalItems}
              currentPage={createdPage}
              onPageChange={handleCreatedPageChange}
              perPage={4}
            />
          )}
          {activeTab === "participating" && (
            <PaginationComponent
              totalItems={participatedTotalItems}
              currentPage={participatedPage}
              onPageChange={handleParticipatedPageChange}
              perPage={4}
            />
          )}
        </CardFooter>
      </Card>

      <CreateBillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBill}
      />
      <BillDetailsModal
        isOpen={!!selectedBillId}
        onClose={() => setSelectedBillId(null)}
        billId={selectedBillId}
        userId={user?.id}
        onBillDeleted={fetchData}
      />
    </div>
  );
};

export default BillsPage;
