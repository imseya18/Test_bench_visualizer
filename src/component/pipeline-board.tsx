import React from "react";
import {
  Card,
  CardBody,
  Badge,
  Button,
  Divider,
  Accordion,
  AccordionItem,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Job {
  id: string;
  name: string;
  status: "success" | "failed" | "running" | "pending";
  duration: number;
  type: "build" | "test" | "deploy" | "validate"; // Add job type
}

interface Pipeline {
  id: string;
  name: string;
  status: "running" | "completed" | "failed" | "pending";
  createdAt: Date;
  updatedAt: Date;
  jobs: Job[];
}

interface PipelineDetailsProps {
  deviceId: number;
  deviceName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PipelineDetails({
  deviceId,
  deviceName,
  isOpen,
  onClose,
}: PipelineDetailsProps) {
  // Mock pipeline data
  const [pipelines] = React.useState<Pipeline[]>(() => {
    const jobTypes: ("build" | "test" | "deploy" | "validate")[] = [
      "build",
      "test",
      "deploy",
      "validate",
    ];
    return Array.from({ length: 5 }, (_, i) => ({
      id: `pip-${i + 1}`,
      name: `Pipeline ${i + 1}`,
      status: ["running", "completed", "failed", "pending"][
        Math.floor(Math.random() * 4)
      ] as Pipeline["status"],
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      updatedAt: new Date(Date.now() - Math.random() * 1000000000),
      jobs: Array.from(
        { length: 8 + Math.floor(Math.random() * 4) },
        (_, j) => ({
          id: `job-${i}-${j}`,
          name: `${jobTypes[j % 4]} ${Math.floor(j / 4) + 1}`,
          type: jobTypes[j % 4],
          status: ["success", "failed", "running", "pending"][
            Math.floor(Math.random() * 4)
          ] as "success" | "failed" | "running" | "pending",
          duration: Math.floor(Math.random() * 300),
        })
      ),
    }));
  });

  const getStatusColor = (status: string) => {
    const colors = {
      running: "primary",
      completed: "success",
      failed: "danger",
      pending: "warning",
      success: "success",
    };
    return colors[status] || "default";
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Group jobs by type
  const groupJobsByType = (jobs: Job[]) => {
    const groups: Record<string, Job[]> = {
      build: [],
      test: [],
      deploy: [],
      validate: [],
    };

    jobs.forEach((job) => {
      if (groups[job.type]) {
        groups[job.type].push(job);
      }
    });

    return groups;
  };

  return (
    <div className="fixed inset-0 bg-content1 z-50 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
              className="text-default-500"
            >
              <Icon icon="lucide:arrow-left" size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Icon icon="lucide:cpu" className="text-primary" />
                {deviceName}
              </h1>
              <p className="text-default-500">Pipeline History</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button color="primary" startContent={<Icon icon="lucide:play" />}>
              Run Pipeline
            </Button>
          </div>
        </div>

        {/* Pipeline List */}
        <div className="w-full">
          <Accordion
            selectionMode="multiple"
            className="gap-4 flex flex-col w-full"
          >
            {pipelines.map((pipeline) => (
              <AccordionItem
                key={pipeline.id}
                aria-label={pipeline.name}
                title={
                  <div className="flex items-center justify-between py-2 w-full">
                    <div className="flex items-center gap-4">
                      <Icon
                        icon="lucide:git-branch"
                        className={`text-${getStatusColor(pipeline.status)}`}
                        size={20}
                      />
                      <div>
                        <div className="font-semibold">{pipeline.name}</div>
                        <div className="text-small text-default-500">
                          Started {pipeline.createdAt.toLocaleDateString()} at{" "}
                          {pipeline.createdAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        color={getStatusColor(pipeline.status)}
                        variant="flat"
                      >
                        {pipeline.status.charAt(0).toUpperCase() +
                          pipeline.status.slice(1)}
                      </Badge>
                      <div className="text-small text-default-500">
                        {pipeline.jobs.length} jobs
                      </div>
                    </div>
                  </div>
                }
                className="border border-content3 rounded-large"
              >
                <div className="px-4 pb-4">
                  <Card className="border border-content3">
                    <CardBody>
                      <div className="grid grid-cols-4 gap-6">
                        {Object.entries(groupJobsByType(pipeline.jobs)).map(
                          ([type, jobs]) => (
                            <div key={type} className="space-y-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Icon
                                  icon={
                                    type === "build"
                                      ? "lucide:box"
                                      : type === "test"
                                      ? "lucide:flask"
                                      : type === "deploy"
                                      ? "lucide:rocket"
                                      : "lucide:check-circle"
                                  }
                                  className="text-primary"
                                />
                                <h3 className="text-medium font-semibold capitalize">
                                  {type}
                                </h3>
                              </div>
                              {jobs.map((job) => (
                                <div
                                  key={job.id}
                                  className="flex items-center justify-between p-3 rounded-medium bg-content2"
                                >
                                  <div className="flex items-center gap-3">
                                    <Badge
                                      color={getStatusColor(job.status)}
                                      variant="flat"
                                      size="sm"
                                    >
                                      <Icon
                                        icon={
                                          job.status === "running"
                                            ? "lucide:loader-2"
                                            : job.status === "success"
                                            ? "lucide:check"
                                            : job.status === "failed"
                                            ? "lucide:x"
                                            : "lucide:clock"
                                        }
                                        className={
                                          job.status === "running"
                                            ? "animate-spin"
                                            : ""
                                        }
                                      />
                                    </Badge>
                                    <div>
                                      <div className="font-medium">
                                        {job.name}
                                      </div>
                                      <div className="text-tiny text-default-500">
                                        Duration: {formatDuration(job.duration)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Tooltip content="View Logs">
                                      <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                      >
                                        <Icon
                                          icon="lucide:file-text"
                                          size={18}
                                        />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip content="Retry Job">
                                      <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        isDisabled={job.status === "running"}
                                      >
                                        <Icon
                                          icon="lucide:refresh-cw"
                                          size={18}
                                        />
                                      </Button>
                                    </Tooltip>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
