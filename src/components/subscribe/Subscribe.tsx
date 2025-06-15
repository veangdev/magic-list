import { BadgeCheck } from "lucide-react";
import { generateMockData } from "../../services/mockData";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Modal } from "../common/Modal";
import { useState } from "react";

interface SubscriptionPlan {
    id: string;
    title: string;
    description: string;
    features: string[];
    price: number;
}
export function Subscribe() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>();

    const toggleSubscribeModal = () => {
        setIsModalOpen((pre: boolean) => !pre);
    }
    const handlePlanSelect = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        toggleSubscribeModal();
    };

  return (
    <div className="text-center py-2">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Subscribe to TaskSphere Pro
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Unlock advanced features designed to streamline your workflow. With the
        Pro plan, you get unlimited projects, team collaboration, deadline
        reminders, file attachments, and priority support — everything you need
        to manage tasks like a pro.
      </p>
      <div className="grid grid-cols-3 gap-5">
        {generateMockData().subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            title={plan.title}
            className="mb-4 flex flex-col h-full"
          >
            <p className="text-gray-600 dark:text-gray-400 h-[15vh]">
              {plan.description}
            </p>
            <ul className="list-none list-inside text-left mb-4 flex flex-col gap-2 h-[25vh]">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-x-2 items-center dark:text-white"
                >
                  {" "}
                  <BadgeCheck className="w-5 h-5 text-green-500" />{" "}
                  <p>{feature}</p>
                </li>
              ))}
            </ul>
            {
                plan.price != 0 &&
                <Button onClick={() => handlePlanSelect(plan)}>Choose Plan ${plan.price} / month</Button>
            }
          </Card>
        ))}
      </div>

      {/* open modal for  subsribe */}
      {
        isModalOpen &&
        <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Subscribe to Pro Plan"
        >   
            <div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You are about to subscribe to the {selectedPlan?.title} for ${selectedPlan?.price}/month.
                </p>
 
                <div className="flex justify-end gap-x-5">
                    <Button className="bg-[red]" onClick={() => {
                        // Handle subscription logic here
                        alert("Subscribed successfully!");
                        setIsModalOpen(false);
                    }}>Cancel</Button>
                    <Button onClick={() => {
                        // Handle subscription logic here
                        alert("Subscribed successfully!");
                        setIsModalOpen(false);
                    }}>Confirm Subscription</Button>
                </div>
            </div>

        </Modal>
      }
    </div>
  );
}
