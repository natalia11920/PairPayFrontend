import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Spinner,
  CardFooter,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { BillDisplay } from "../../types/Bill";
import {
  getBillsCreatedAPI,
  getBillsParticipatedAPI,
} from "../../services/BillServices";
import { PaginationComponent } from "../../components/PaginationComponent";

type Props = {};

const BillsPage = (props: Props) => {
  const [createdBills, setCreatedBills] = useState<BillDisplay[]>([]);
  const [participatedBills, setParticipatedBills] = useState<BillDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<BillDisplay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createdPage, setCreatedPage] = useState(1);
  const [participatedPage, setParticipatedPage] = useState(1);
  const [createdTotalItems, setCreatedTotalItems] = useState(0);
  const [participatedTotalItems, setParticipatedTotalItems] = useState(0);

  const [activeTab, setActiveTab] = useState<string>("created");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [createdResponse, participatedResponse] = await Promise.all([
        getBillsCreatedAPI(createdPage, 4),
        getBillsParticipatedAPI(participatedPage, 4),
      ]);

      setCreatedBills(createdResponse.bills);
      setCreatedTotalItems(createdResponse.totalItems);
      setParticipatedBills(participatedResponse.bills);
      setParticipatedTotalItems(participatedResponse.totalItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [createdPage, participatedPage]);

  const openModal = (bill: BillDisplay) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBill(null);
    setIsModalOpen(false);
  };

  const handleCreatedPageChange = (page: number) => {
    setCreatedPage(page);
  };

  const handleParticipatedPageChange = (page: number) => {
    setParticipatedPage(page);
  };

  const tabs = [
    {
      id: "created",
      label: "Created Bills",
      content: createdBills.length ? (
        createdBills.map((bill) => (
          <Card
            key={bill.id}
            isPressable
            className="mb-4"
            onClick={() => openModal(bill)}
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
            onClick={() => openModal(bill)}
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
  ];

  return (
    <div className="flex flex-col items-center mt-10">
      <Card className="w-full max-w-3xl p-2">
        <CardHeader>
          <h2>Bills Manager</h2>
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
        <CardFooter style={{ display: "flex", justifyContent: "flex-end" }}>
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
    </div>
  );
};

export default BillsPage;
