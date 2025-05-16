import { Card, CardBody, CardFooter, Tooltip, Divider, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { CardPropreties } from '../utils/board-store';
import { useBoardStore } from '../utils/board-store';
import { useNavigate } from 'react-router-dom';
import { ChooseCard } from './choose-card';
import { CardProgressBar } from './card-progress-bar';
import {
  getSuccessfulJobTypeSize,
  getJobTypeSize,
  getStatusColor,
  getJobTypeStatus,
} from '../utils/job-utilities';
import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';

// function getPipelineStatusByCard(pipeline: PipelineJobsResponse) {
//   const successJob = getSuccessfulJobTypeSize(pipeline);
//   const totalJoblen = getJobTypeSize(pipeline);

//   return successJob === totalJoblen ? 'success' : 'failed';
// }
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

  const status = getJobTypeStatus(lastestPipeline);
  const borederColor = getStatusColor(status);
  return (
    <Card className={`flex flex-col h-full border-${borederColor} border-1`}>
      <CardBody className='p-3 gap-2'>
        <div className='flex justify-between items-center'>
          <h3 className='text-medium font-semibold'>{type}</h3>
          {/* <Badge color={status === 'RUNNING' ? 'success' : 'default'} variant='flat' size='sm'>
            {status}
          </Badge> */}
        </div>

        <Divider className='my-2' />
        {/* Build Result */}
        <CardProgressBar name={'build'} pipelineJobs={lastestPipeline} />
        {/* test Result */}
        <CardProgressBar name={'test'} pipelineJobs={lastestPipeline} />
        {/* test-offiline Result */}
        <CardProgressBar name={'test_offline'} pipelineJobs={lastestPipeline} />

        <div className='mt-3 gap-2'>
          <Tooltip content='Pipelines Data'>
            <div
              className='bg-content2 rounded-md p-2 flex items-center justify-center'
              onClick={() => openPipelineDetails(id, type)}
            >
              <Icon icon='lucide:bar-chart-2' className='text-default-400' />
            </div>
          </Tooltip>
          {/* <Tooltip content='Future: Temperature Data'>
            <div className='bg-content2 rounded-md p-2 flex items-center justify-center'>
              <Icon icon='lucide:thermometer' className='text-default-400' />
            </div>
          </Tooltip> */}
        </div>
      </CardBody>
      <CardFooter className='p-2 border-t border-content2 justify-between'>
        <div className='flex items-center'>
          <Icon icon='lucide:cpu' className='text-default-400 mr-1' size={14} />
          <span className='text-tiny text-default-400'>{lastestPipeline.id.toString()}</span>
        </div>
        <Tooltip content='View Details'>
          <Icon icon='lucide:chevron-right' className='text-default-400' />
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
