import React, { useEffect, useMemo } from 'react';
import {
  Card,
  CardBody,
  Badge,
  Button,
  Accordion,
  AccordionItem,
  Tooltip,
  Spinner,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBoardStore } from '../utils/board-store';
import {
  JobStatus,
  jobKeys,
  getSuccessfulJobTypeSize,
  getJobTypeSize,
  getStatusColor,
} from '../utils/job-utilities';
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

export function PipelineDetails({ deviceName, onClose }: PipelineDetailsProps) {
  const pipelinesRecord = useBoardStore((state) => state.gitLabData[deviceName]);

  const isLoading = useBoardStore((state) => state.isLoading);
  const pipelines = useMemo(
    () =>
      isLoading && Object.keys(pipelinesRecord).length === 0
        ? [] // pendant le chargement, un tableau vide
        : Object.values(pipelinesRecord),
    [isLoading, pipelinesRecord],
  );

  if (isLoading && pipelines.length === 0) {
    return (
      <div className='fixed inset-0 flex items-center justify-center'>
        <Spinner size='lg' label='Waiting for result...'></Spinner>
      </div>
    );
  }
  if (pipelines.length === 0) {
    return (
      <div className='fixed inset-0 flex items-center justify-center'>
        No pipelines found for « {deviceName} »
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return pipelines ? (
    <div className='fixed inset-0 bg-content1 z-50 overflow-auto'>
      <div className='p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <Button isIconOnly variant='light' onPress={onClose} className='text-default-500'>
              <Icon icon='lucide:arrow-left' size={20} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold flex items-center gap-2'>
                <Icon icon='lucide:cpu' className='text-primary' />
                {deviceName}
              </h1>
              <p className='text-default-500'>Pipeline History</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button color='primary' startContent={<Icon icon='lucide:play' />}>
              Run Pipeline
            </Button>
          </div>
        </div>

        {/* Pipeline List */}
        <div className='w-full'>
          <Accordion selectionMode='multiple' className='gap-4 flex flex-col w-full'>
            {pipelines.reverse().map((pipeline) => {
              const successfulJobLen = getSuccessfulJobTypeSize(pipeline);
              const totalJobLen = getJobTypeSize(pipeline);
              const isPipelineSuccess = successfulJobLen === totalJobLen ? true : false;
              const date = new Date(pipeline.updated_at);

              return (
                <AccordionItem
                  key={pipeline.id}
                  aria-label={pipeline.id.toString()}
                  title={
                    <div className='flex items-center justify-between py-2 w-full'>
                      <div className='flex items-center gap-4'>
                        <Icon
                          icon='lucide:git-branch'
                          className={
                            isPipelineSuccess
                              ? 'text-success'
                              : `text-${getStatusColor(pipeline.status as JobStatus)}`
                          }
                          size={20}
                        />
                        <div>
                          <div className='font-semibold'>{pipeline.title}</div>
                          <div className='text-small text-default-500'>
                            Started {date.toLocaleDateString('fr-FR')} at{' '}
                            {date.toLocaleTimeString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Badge
                          color={
                            isPipelineSuccess
                              ? 'success'
                              : getStatusColor(pipeline.status as JobStatus)
                          }
                          variant='solid'
                        >
                          {isPipelineSuccess
                            ? 'Success'
                            : pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
                        </Badge>
                        <div className='text-small text-default-500'>
                          {successfulJobLen}/{totalJobLen} jobs
                        </div>
                      </div>
                    </div>
                  }
                  className='border border-content3 rounded-large'
                >
                  <div className='px-4 pb-4'>
                    <Card className='border border-content3'>
                      <CardBody>
                        <div className='grid grid-cols-4 gap-6'>
                          {jobKeys.map((type) => (
                            <div key={type} className='space-y-4'>
                              <div className='flex items-center gap-2 mb-3'>
                                <Icon
                                  icon={
                                    type === 'build'
                                      ? 'lucide:box'
                                      : type === 'test'
                                      ? 'lucide:flask-conical'
                                      : type === 'test_offline'
                                      ? 'lucide:flask-conical-off'
                                      : 'lucide:check-circle'
                                  }
                                  className='text-primary'
                                />
                                <h3 className='text-medium font-semibold capitalize'>{type}</h3>
                              </div>
                              {pipeline[type].map((job) => (
                                <div
                                  key={job.id}
                                  className='flex items-center justify-between p-3 rounded-medium bg-content2'
                                >
                                  <div className='flex items-center gap-3'>
                                    <Icon
                                      icon={
                                        job.status === 'running'
                                          ? 'lucide:loader-2'
                                          : job.status === 'success'
                                          ? 'lucide:check'
                                          : job.status === 'failed'
                                          ? 'lucide:x'
                                          : 'lucide:clock'
                                      }
                                      className={
                                        job.status === 'running'
                                          ? 'animate-spin'
                                          : `text-${getStatusColor(job.status as JobStatus)}`
                                      }
                                      height='1.5em'
                                    />
                                    <div>
                                      <div className='font-medium'>{job.name}</div>
                                      {/* <div className="text-tiny text-default-500">
                                        Duration: {formatDuration(job.duration)}
                                      </div> */}
                                    </div>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <Tooltip content='View Logs'>
                                      <Button isIconOnly variant='light' size='sm'>
                                        <Icon icon='lucide:file-text' size={18} />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip content='Retry Job'>
                                      <Button
                                        isIconOnly
                                        variant='light'
                                        size='sm'
                                        isDisabled={job.status === 'running'}
                                      >
                                        <Icon icon='lucide:refresh-cw' size={18} />
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
