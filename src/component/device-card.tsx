import React from 'react';
import { Card, CardBody, CardFooter, Badge, Tooltip, Divider, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { CardPropreties } from '../utils/board-store';
import { useBoardStore } from '../utils/board-store';
import { useNavigate } from 'react-router-dom';
import { ChooseCard } from './choose-card';
import { getSuccesfulJobSize, getJobSize } from '../utils/job-utilities';

export function DeviceCard({ id }: CardPropreties) {
  const useGetCard = useBoardStore((state) => state.getCard);
  const card = useGetCard(id);
  const navigate = useNavigate();
  if (!card) return;

  const { type } = card;

  const pipelinesRecord = useBoardStore((state) => state.gitLabData[type as string]);
  const isLoading = useBoardStore((state) => state.isLoading);

  const openPipelineDetails = (deviceId: string, deviceName: string) => {
    navigate('/pipelines', {
      state: {
        deviceId,
        deviceName,
        isOpen: true,
      },
    });
  };

  if (!type) {
    return <ChooseCard id={id} />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  const pipeline = Object.values(pipelinesRecord);
  const lastestPipeline = pipeline.at(-1);
  if (!lastestPipeline) {
    return <div className='flex justify-center items-center'>no pipeline found for {type}</div>;
  }
  const completedTests = getSuccesfulJobSize(lastestPipeline);
  const totalTests = getJobSize(lastestPipeline);
  const progressPercentage = completedTests && totalTests ? (completedTests / totalTests) * 100 : 0;
  const status = lastestPipeline.status;

  return (
    <Card className='  flex flex-col h-full border-gray-500 border-1'>
      <CardBody className='p-3 gap-2'>
        <div className='flex justify-between items-center'>
          <h3 className='text-medium font-semibold'>{type}</h3>
          <Badge color={status === 'RUNNING' ? 'success' : 'default'} variant='flat' size='sm'>
            {status}
          </Badge>
        </div>

        <Divider className='my-2' />

        <div className='flex justify-between items-center'>
          <span className='text-small text-default-500'>Tests:</span>
          <span className='text-small font-medium'>
            {completedTests}/{totalTests}
          </span>
        </div>

        <div className='w-full bg-default-100 rounded-full h-2 mt-1'>
          <div
            className={`h-2 rounded-full ${status === 'RUNNING' ? 'bg-success' : 'bg-default-400'}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className='mt-3 grid grid-cols-2 gap-2'>
          <Tooltip content='Pipelines Data'>
            <div
              className='bg-content2 rounded-md p-2 flex items-center justify-center'
              onClick={() => openPipelineDetails(id, type)}
            >
              <Icon icon='lucide:bar-chart-2' className='text-default-400' />
            </div>
          </Tooltip>
          <Tooltip content='Future: Temperature Data'>
            <div className='bg-content2 rounded-md p-2 flex items-center justify-center'>
              <Icon icon='lucide:thermometer' className='text-default-400' />
            </div>
          </Tooltip>
        </div>
      </CardBody>
      <CardFooter className='p-2 border-t border-content2 justify-between'>
        <div className='flex items-center'>
          <Icon icon='lucide:cpu' className='text-default-400 mr-1' size={14} />
          <span className='text-tiny text-default-400'>Unit {id}</span>
        </div>
        <Tooltip content='View Details'>
          <Icon icon='lucide:chevron-right' className='text-default-400' />
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
