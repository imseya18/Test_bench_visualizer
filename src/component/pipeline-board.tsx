import React, { useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  Badge,
  Button,
  Accordion,
  AccordionItem,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBoardStore } from "../utils/board-store";
import { PipelineJobsResponse } from "../bindings/PipelineJobsResponse";
//Wrapper needed to path component's props to our navigation
export function PipelineDetailsWrapper() {
  const { state } = useLocation() as {
    state: { deviceId: number; deviceName: string; isOpen: boolean };
  };
  const navigate = useNavigate();

  const onClose = () => navigate(-1);

  return (
    <PipelineDetails
      deviceId={state.deviceId}
      deviceName={state.deviceName}
      isOpen={state.isOpen}
      onClose={onClose}
    />
  );
}

interface PipelineDetailsProps {
  deviceId: number;
  deviceName: string;
  isOpen: boolean;
  onClose: () => void;
}

type JobKeys = "build" | "cve" | "test" | "test_offline" | "unknown";
type JobStatus = "running" | "completed" | "failed" | "pending" | "success";
const jobKeys: JobKeys[] = ["build", "cve", "test", "test_offline", "unknown"];

export function PipelineDetails({
  deviceId,
  deviceName,
  isOpen,
  onClose,
}: PipelineDetailsProps) {
  const pipelinesRecord = useBoardStore(
    (state) => state.gitLabData[deviceName]
  );

  const isLoading = useBoardStore((state) => state.isLoading);
  const pipelines = useMemo(
    () =>
      isLoading
        ? [] // pendant le chargement, un tableau vide
        : Object.values(pipelinesRecord),
    [isLoading, pipelinesRecord]
  );

  useEffect(() => {
    console.log(pipelines);
  }, [pipelines]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <span>Chargement en cours…</span>
      </div>
    );
  }

  //Mock pipeline data
  //   const [pipelines] = React.useState<Pipeline[]>(() => {
  //     const jobTypes: ("build" | "test" | "deploy" | "validate")[] = [
  //       "build",
  //       "test",
  //       "deploy",
  //       "validate",
  //     ];
  //     return Array.from({ length: 5 }, (_, i) => ({
  //       id: `pip-${i + 1}`,
  //       name: `Pipeline ${i + 1}`,
  //       status: ["running", "completed", "failed", "pending"][
  //         Math.floor(Math.random() * 4)
  //       ] as Pipeline["status"],
  //       createdAt: new Date(Date.now() - Math.random() * 10000000000),
  //       updatedAt: new Date(Date.now() - Math.random() * 1000000000),
  //       jobs: Array.from(
  //         { length: 8 + Math.floor(Math.random() * 4) },
  //         (_, j) => ({
  //           id: `job-${i}-${j}`,
  //           name: `${jobTypes[j % 4]} ${Math.floor(j / 4) + 1}`,
  //           type: jobTypes[j % 4],
  //           status: ["success", "failed", "running", "pending"][
  //             Math.floor(Math.random() * 4)
  //           ] as "success" | "failed" | "running" | "pending",
  //           duration: Math.floor(Math.random() * 300),
  //         })
  //       ),
  //     }));
  //   });

  const getStatusColor = (status: JobStatus) => {
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

  const getJobSize = (pipeline: PipelineJobsResponse) => {
    const jobLen = jobKeys.reduce(
      (sum, type) => sum + pipeline[type].length,
      0
    );
    return jobLen;
  };

  const getSuccesfulJobSize = (pipeline: PipelineJobsResponse) => {
    return jobKeys.reduce((sum, type) => {
      const success = pipeline[type].filter(
        (job) => job.status === "success"
      ).length;
      return sum + success;
    }, 0);
  };
  return pipelines ? (
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
            {pipelines.map((pipeline) => {
              const successfulJobLen = getSuccesfulJobSize(pipeline);
              const totalJobLen = getJobSize(pipeline);
              const isPipelineSuccess =
                successfulJobLen === totalJobLen ? true : false;
              return (
                <AccordionItem
                  key={pipeline.id}
                  aria-label={pipeline.id.toString()}
                  title={
                    <div className="flex items-center justify-between py-2 w-full">
                      <div className="flex items-center gap-4">
                        <Icon
                          icon="lucide:git-branch"
                          className={
                            isPipelineSuccess
                              ? "text-success"
                              : `text-${getStatusColor(
                                  pipeline.status as JobStatus
                                )}`
                          }
                          size={20}
                        />
                        <div>
                          <div className="font-semibold">{pipeline.title}</div>
                          <div className="text-small text-default-500">
                            Started {pipeline.created_at} at{" "}
                            {pipeline.created_at}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          color={
                            isPipelineSuccess
                              ? ("success" as JobStatus)
                              : getStatusColor(pipeline.status as JobStatus)
                          }
                          variant="solid"
                        >
                          {isPipelineSuccess
                            ? "Success"
                            : pipeline.status.charAt(0).toUpperCase() +
                              pipeline.status.slice(1)}
                        </Badge>
                        <div className="text-small text-default-500">
                          {successfulJobLen}/{totalJobLen} jobs
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
                          {jobKeys.map((type) => (
                            <div key={type} className="space-y-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Icon
                                  icon={
                                    type === "build"
                                      ? "lucide:box"
                                      : type === "test"
                                      ? "lucide:flask-conical"
                                      : type === "test_offline"
                                      ? "lucide:flask-conical-off"
                                      : type === "unknown"
                                      ? "lucide:rocket"
                                      : "lucide:check-circle"
                                  }
                                  className="text-primary"
                                />
                                <h3 className="text-medium font-semibold capitalize">
                                  {type}
                                </h3>
                              </div>
                              {pipeline[type].map((job) => (
                                <div
                                  key={job.id}
                                  className="flex items-center justify-between p-3 rounded-medium bg-content2"
                                >
                                  <div className="flex items-center gap-3">
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
                                          : `text-${getStatusColor(
                                              job.status as JobStatus
                                            )}`
                                      }
                                      height="1.5em"
                                    />
                                    <div>
                                      <div className="font-medium">
                                        {job.name}
                                      </div>
                                      {/* <div className="text-tiny text-default-500">
                                        Duration: {formatDuration(job.duration)}
                                      </div> */}
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
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
