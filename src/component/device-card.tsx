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
import { CARD_TYPE_ARRAY } from "../utils/global-variable";
import { CardPropreties } from "../utils/board-store";
import { useBoardStore } from "../utils/board-store";
import { CardType } from "../utils/global-variable";

export function DeviceCard({ id }: CardPropreties) {
  const useGetCard = useBoardStore((state) => state.getCard);
  const useUpdateCard = useBoardStore((state) => state.updateCard);
  const card = useGetCard(id);
  if (!card) return;

  const { type, status, completedTests, totalTests } = card;

  const progressPercentage =
    completedTests && totalTests ? (completedTests / totalTests) * 100 : 0;

  const updateCard = (patch: Partial<CardPropreties>) => {
    useUpdateCard(id, patch);
  };

  return type ? (
    <Card className="  flex flex-col h-full border-gray-500 border-1">
      <CardBody className="p-3 gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-medium font-semibold">{type}</h3>
          <Badge
            color={status === "RUNNING" ? "success" : "default"}
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
              status === "RUNNING" ? "bg-success" : "bg-default-400"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Tooltip content="Pipelines Data">
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
        <DropdownMenu
          aria-label="Types de composants"
          onAction={(key) => updateCard({ type: key as CardType })}
        >
          {CARD_TYPE_ARRAY.map((type) => (
            <DropdownItem key={type}>{type}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </Card>
  );
}
