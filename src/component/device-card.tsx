import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Spinner,
  Dropdown,
  DropdownTrigger,
  //   Button,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { CardPropreties } from '../stores/card-store';
import { useCardStore } from '../stores/card-store';
import { useNavigate } from 'react-router-dom';
import { useGitLabStore } from '../stores/gitlab-store';
import { ChooseCard } from './choose-card';
import { CardProgressBar } from './card-progress-bar';
import { getStatusColor, getJobTypeStatus } from '../utils/job-utilities';
import { CARD_TYPE_ARRAY } from '../utils/global-variable';
import { CardType } from '../utils/global-variable';
import { Skeleton } from '@heroui/skeleton';

export function DeviceCard({ id, onBoardPosition }: CardPropreties) {
  const useGetCard = useCardStore((state) => state.getCard);
  const gitLabData = useGitLabStore((State) => State.gitLabData);
  const card = useGetCard(id);
  const navigate = useNavigate();
  const useUpdateCard = useCardStore((state) => state.updateCard);
  const updateCard = (patch: Partial<CardPropreties>) => {
    useUpdateCard(id, patch);
  };
  if (!card) return;

  const { type } = card;
  const pipelinesRecord = useGitLabStore((state) => state.gitLabData[type as string]);
  const isLoading = useGitLabStore((state) => state.isLoading);
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
    return (
      <Card
        isPressable={false}
        className='  flex flex-col h-full border-gray-500 border-1 justify-center items-center'
      >
        <ChooseCard id={id} onBoardPosition={onBoardPosition} />
      </Card>
    );
  }

  if (isLoading && Object.keys(gitLabData).length === 0) {
    return (
      <Card className='flex flex-col h-full'>
        <Skeleton className='p-3 gap-2'></Skeleton>
        <Divider className='my-1' />
        <div className='flex-1 flex justify-center items-center'>
          <Spinner></Spinner>
        </div>
      </Card>
    );
  }

  const pipeline = Object.values(pipelinesRecord ?? {});
  const lastestPipeline = pipeline.at(-1);
  if (!lastestPipeline) {
    return (
      <Card
        isPressable={false}
        className='  flex flex-col h-full border-gray-500 border-1 justify-center items-center'
      >
        <div className='mb-5 w-full text-center'>
          no pipeline found for
          <br /> {type}
        </div>
        <ChooseCard id={id} onBoardPosition={onBoardPosition} />
      </Card>
    );
  }
  const status = getJobTypeStatus(lastestPipeline, ['build', 'test', 'test_offline']);
  const borederColor = getStatusColor(status);
  const date = new Date(lastestPipeline.updated_at);
  return (
    <Card
      className={`flex flex-col h-full border-${borederColor} border-1 cursor-pointer`}
      isPressable
      onPress={() => openPipelineDetails(id, type)}
    >
      <CardBody className='p-2 gap-1'>
        <div className='flex justify-between items-center'>
          <h3 className='text-sm font-semibold'>{type}</h3>
          <Dropdown>
            <DropdownTrigger>
              {/* <Button
                variant='light'
                color='default'
                isIconOnly
                startContent={<Icon icon='lucide:arrow-down' />}
              ></Button> */}
              <span
                role='button'
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className='p-2.5 hover:bg-gray-700 opacity-70 rounded-xl'
              >
                <Icon icon='lucide:arrow-down' />
              </span>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Types de composants'
              onAction={(key) => updateCard({ type: key as CardType })}
            >
              {CARD_TYPE_ARRAY.map((type) => (
                <DropdownItem key={type === 'no card' ? '' : type}>{type}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        <Divider className='mg-0' />
        {/* Build Result */}
        <CardProgressBar
          type={'build'}
          pipelineJobs={lastestPipeline}
          pipelineStatus={lastestPipeline.status}
        />
        {/* test Result */}
        <CardProgressBar
          type={'test'}
          pipelineJobs={lastestPipeline}
          pipelineStatus={lastestPipeline.status}
        />
        {/* test-offiline Result */}
        <CardProgressBar
          type={'test_offline'}
          pipelineJobs={lastestPipeline}
          pipelineStatus={lastestPipeline.status}
        />
      </CardBody>
      <CardFooter className='p-2 border-t border-content2 justify-between'>
        <div className='flex items-center'>
          <Icon icon='icon-park-outline:branch-two' className='text-default-400 mr-1' />
          <span className='text-tiny text-default-400'>{Number(lastestPipeline.id)}</span>
        </div>
        <span className='text-tiny text-default-400'>{date.toLocaleDateString('fr-FR')}</span>
      </CardFooter>
    </Card>
  );
}
