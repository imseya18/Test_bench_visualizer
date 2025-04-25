import React from "react";
import { Button, Tooltip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-16 bg-content2 flex flex-col items-center py-4 border-r border-content3">
      <Tooltip content="Dashboard" placement="right">
        <Button
          isIconOnly
          variant="light"
          color="primary"
          className="mb-4"
          aria-label="Dashboard"
        >
          <Icon icon="lucide:layout-dashboard" width={24} />
        </Button>
      </Tooltip>

      <Tooltip content="Test Bench" placement="right">
        <Button
          isIconOnly
          variant="flat"
          color="primary"
          className="mb-4"
          aria-label="Test Bench"
        >
          <Icon icon="lucide:cpu" width={24} />
        </Button>
      </Tooltip>

      <Tooltip content="Analytics" placement="right">
        <Button
          isIconOnly
          variant="light"
          className="mb-4"
          aria-label="Analytics"
        >
          <Icon icon="lucide:bar-chart-2" width={24} />
        </Button>
      </Tooltip>

      <Tooltip content="Settings" placement="right">
        <Button
          isIconOnly
          variant="light"
          className="mb-4"
          aria-label="Settings"
        >
          <Icon icon="lucide:settings" width={24} />
        </Button>
      </Tooltip>

      <Divider className="my-4 w-8" />

      <Tooltip content="Start All Tests" placement="right">
        <Button
          isIconOnly
          variant="light"
          color="success"
          className="mb-4"
          aria-label="Start All Tests"
        >
          <Icon icon="lucide:play" width={24} />
        </Button>
      </Tooltip>

      <Tooltip content="Stop All Tests" placement="right">
        <Button
          isIconOnly
          variant="light"
          color="danger"
          className="mb-4"
          aria-label="Stop All Tests"
        >
          <Icon icon="lucide:square" width={24} />
        </Button>
      </Tooltip>

      <div className="mt-auto">
        <Tooltip content="Help" placement="right">
          <Button isIconOnly variant="light" className="mb-4" aria-label="Help">
            <Icon icon="lucide:help-circle" width={24} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
