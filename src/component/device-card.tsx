import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Badge,
  Tooltip,
  Divider,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { TYPE_OF_CARDS } from "../utils";
interface DeviceCardProperties {
  id: number;
  name: string | undefined;
  status: "Running" | "Idle";
  completedTests: number;
  totalTests: number;
}

export function DeviceCard({
  id,
  name,
  status,
  completedTests,
  totalTests,
}: DeviceCardProperties) {
  const progressPercentage = (completedTests / totalTests) * 100;

  return name ? (
    <Card
      isPressable
      className="  flex flex-col h-full border-gray-500 border-1"
      onPress={() => console.log(`Clicked on ${name}`)}
    >
      <CardBody className="p-3 gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-medium font-semibold">{name}</h3>
          <Badge
            color={status === "Running" ? "success" : "default"}
            variant="flat"
            size="sm"
          >
            {status}
          </Badge>
        </div>

        <Divider className="my-2" />

        <div className="flex justify-between items-center">
          <span className="text-small text-default-500">Tests:</span>
          <span className="text-small font-medium">
            {completedTests}/{totalTests}
          </span>
        </div>

        <div className="w-full bg-default-100 rounded-full h-2 mt-1">
          <div
            className={`h-2 rounded-full ${
              status === "Running" ? "bg-success" : "bg-default-400"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Tooltip content="Future: Performance Metrics">
            <div className="bg-content2 rounded-md p-2 flex items-center justify-center">
              <Icon icon="lucide:bar-chart-2" className="text-default-400" />
            </div>
          </Tooltip>
          <Tooltip content="Future: Temperature Data">
            <div className="bg-content2 rounded-md p-2 flex items-center justify-center">
              <Icon icon="lucide:thermometer" className="text-default-400" />
            </div>
          </Tooltip>
        </div>
      </CardBody>
      <CardFooter className="p-2 border-t border-content2 justify-between">
        <div className="flex items-center">
          <Icon icon="lucide:cpu" className="text-default-400 mr-1" size={14} />
          <span className="text-tiny text-default-400">Unit {id}</span>
        </div>
        <Tooltip content="View Details">
          <Icon icon="lucide:chevron-right" className="text-default-400" />
        </Tooltip>
      </CardFooter>
    </Card>
  ) : (
    <Card
      isPressable={false}
      className="  flex flex-col h-full border-gray-500 border-1 justify-center items-center"
    >
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="flat"
            color="primary"
            startContent={<Icon icon="lucide:plus" />}
          >
            Ajouter un composant
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Types de composants">
          {TYPE_OF_CARDS.map((type, index) => (
            <DropdownItem key={index}>{type}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </Card>
  );
}
